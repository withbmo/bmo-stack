import {
  BadRequestException,
  ConflictException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { getPlanCatalogVersion, getPlanRank as getConfigPlanRank } from '@pytholit/config';
import {
  BILLING_INTERVALS,
  type BillingInterval,
  type CheckoutSessionResponse,
  PAID_PLAN_IDS,
  type PaidPlanId,
  type PlanId,
} from '@pytholit/contracts';
import type Stripe from 'stripe';

import { StripeMetadataKey } from './billing.constants';
import { BillingAccessService } from './billing-access.service';
import { BILLING_ERROR_CODE } from './billing-error-codes';
import {
  buildBillingPlanCode,
  parseBillingPlanCode,
  planIdFromBillingPlanCode,
} from './billing-plan-code';
import { StripeContextService } from './stripe-context.service';
import { extractBillingPlanCodeFromSubscription } from './utils/stripe-plan-code.utils';
import { pickPlanSubscriptionItem } from './utils/stripe-subscription-item.utils';

@Injectable()
export class StripeSubscriptionService {
  constructor(
    private readonly stripeContext: StripeContextService,
    private readonly billingAccess: BillingAccessService
  ) {}

  /** Creates Stripe Billing Portal session for payment-method management. */
  async createPortalSession(userId: string): Promise<{ url: string }> {
    const { stripe, stripeCustomerId } = await this.stripeContext.getStripeContextForUser(userId);
    const configurationId = await this.getOrCreatePortalConfigurationId(stripe);

    const returnUrl = `${this.stripeContext.requireFrontendUrl()}/dashboard/settings/billing`;
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl,
      configuration: configurationId,
    });

    if (!session.url) {
      throw new ServiceUnavailableException({
        code: BILLING_ERROR_CODE.STRIPE_PORTAL_FAILED,
        detail: 'Stripe portal session did not return a URL.',
      });
    }

    return { url: session.url };
  }

  /** Schedules active subscription cancellation at period end without redirecting to portal. */
  async cancelSubscriptionAtPeriodEnd(userId: string): Promise<{ cancelAtPeriodEnd: true }> {
    const { stripe, stripeCustomerId } = await this.stripeContext.getStripeContextForUser(userId);
    const existing = await this.stripeContext.getLatestStripeSubscription(stripe, stripeCustomerId);
    if (!existing || existing.status === 'canceled' || existing.status === 'incomplete_expired') {
      throw new ConflictException({
        code: BILLING_ERROR_CODE.BILLING_STRIPE_SUBSCRIPTION_NOT_FOUND,
        detail: 'No cancelable Stripe subscription found.',
      });
    }

    const scheduleId = this.getSubscriptionScheduleId(existing);
    if (scheduleId) {
      const schedule = await stripe.subscriptionSchedules.retrieve(scheduleId);
      if (schedule.end_behavior === 'cancel') return { cancelAtPeriodEnd: true };
      await stripe.subscriptionSchedules.update(scheduleId, {
        end_behavior: 'cancel',
      });
      return { cancelAtPeriodEnd: true };
    }

    if (existing.cancel_at_period_end) return { cancelAtPeriodEnd: true };

    await stripe.subscriptions.update(existing.id, {
      cancel_at_period_end: true,
      proration_behavior: 'none',
    });
    return { cancelAtPeriodEnd: true };
  }

  /** Removes scheduled period-end cancellation for active subscription. */
  async reactivateSubscription(userId: string): Promise<{ cancelAtPeriodEnd: false }> {
    const { stripe, stripeCustomerId } = await this.stripeContext.getStripeContextForUser(userId);
    const existing = await this.stripeContext.getLatestStripeSubscription(stripe, stripeCustomerId);
    if (!existing || existing.status === 'canceled' || existing.status === 'incomplete_expired') {
      throw new ConflictException({
        code: BILLING_ERROR_CODE.BILLING_STRIPE_SUBSCRIPTION_NOT_FOUND,
        detail: 'No reactivatable Stripe subscription found.',
      });
    }

    const scheduleId = this.getSubscriptionScheduleId(existing);
    if (scheduleId) {
      const schedule = await stripe.subscriptionSchedules.retrieve(scheduleId);
      if (schedule.end_behavior !== 'cancel') return { cancelAtPeriodEnd: false };
      await stripe.subscriptionSchedules.update(scheduleId, {
        end_behavior: 'release',
      });
      return { cancelAtPeriodEnd: false };
    }

    if (!existing.cancel_at_period_end) return { cancelAtPeriodEnd: false };

    await stripe.subscriptions.update(existing.id, {
      cancel_at_period_end: false,
    });
    return { cancelAtPeriodEnd: false };
  }

  /** Cancels scheduled downgrade while keeping current subscription active. */
  async cancelScheduledDowngrade(userId: string): Promise<{ cleared: true }> {
    const { stripe, stripeCustomerId } = await this.stripeContext.getStripeContextForUser(userId);
    const existing = await this.stripeContext.getLatestStripeSubscription(stripe, stripeCustomerId);
    if (!existing || existing.status === 'canceled' || existing.status === 'incomplete_expired') {
      throw new ConflictException({
        code: BILLING_ERROR_CODE.BILLING_STRIPE_SUBSCRIPTION_NOT_FOUND,
        detail: 'No active Stripe subscription found.',
      });
    }

    const scheduleId = this.getSubscriptionScheduleId(existing);
    if (!scheduleId) {
      throw new ConflictException({
        code: BILLING_ERROR_CODE.BILLING_STRIPE_SCHEDULED_DOWNGRADE_NOT_FOUND,
        detail: 'No scheduled downgrade found.',
      });
    }

    const schedule = await stripe.subscriptionSchedules.retrieve(scheduleId, {
      expand: ['phases.items.price'],
    });
    const nowSec = Math.floor(Date.now() / 1000);
    const nextPhase =
      schedule.phases.find(phase => typeof phase.start_date === 'number' && phase.start_date > nowSec) ??
      null;
    if (!nextPhase) {
      throw new ConflictException({
        code: BILLING_ERROR_CODE.BILLING_STRIPE_SCHEDULED_DOWNGRADE_NOT_FOUND,
        detail: 'No scheduled downgrade found.',
      });
    }

    const currentPlanCode = extractBillingPlanCodeFromSubscription(existing);
    const currentPlan = currentPlanCode ? parseBillingPlanCode(currentPlanCode) : null;
    const nextPriceRef = nextPhase.items?.[0]?.price ?? null;
    const nextPlanCode = await this.extractLookupKeyFromPriceRef(stripe, nextPriceRef);
    const nextPlan = nextPlanCode ? parseBillingPlanCode(nextPlanCode) : null;
    if (
      !currentPlan ||
      !nextPlan ||
      (getConfigPlanRank(nextPlan.planId) ?? Number.POSITIVE_INFINITY) >=
        (getConfigPlanRank(currentPlan.planId) ?? Number.NEGATIVE_INFINITY)
    ) {
      throw new ConflictException({
        code: BILLING_ERROR_CODE.BILLING_STRIPE_SCHEDULED_DOWNGRADE_NOT_FOUND,
        detail: 'No scheduled downgrade found.',
      });
    }

    await stripe.subscriptionSchedules.release(scheduleId, { preserve_cancel_date: true });
    return { cleared: true };
  }

  private getSubscriptionScheduleId(subscription: Stripe.Subscription): string {
    const scheduleRef = (subscription as Stripe.Subscription & { schedule?: unknown }).schedule;
    const scheduleObj = scheduleRef as { id?: unknown } | null;
    return (
      typeof scheduleRef === 'string'
        ? scheduleRef
        : scheduleObj && typeof scheduleObj === 'object' && 'id' in scheduleObj
          ? String(scheduleObj.id ?? '')
          : ''
    );
  }

  private async extractLookupKeyFromPriceRef(
    stripe: Stripe,
    priceRef: string | Stripe.Price | Stripe.DeletedPrice | null | undefined
  ): Promise<string | null> {
    if (!priceRef) return null;
    if (typeof priceRef === 'string') {
      const price = await stripe.prices.retrieve(priceRef);
      return price.lookup_key ?? null;
    }
    if ('deleted' in priceRef && priceRef.deleted) return null;
    return priceRef.lookup_key ?? null;
  }

  /** Creates Stripe Checkout payment session for one-off wallet top-up. */
  async createCreditTopupSession(userId: string, amountUsd: number): Promise<{ url: string }> {
    const billingAccountId = userId;
    const { stripe, stripeCustomerId } = await this.stripeContext.getStripeContextForUser(userId);

    const amountCents = Math.round(Number(amountUsd) * 100);
    if (!Number.isFinite(amountCents) || !Number.isInteger(amountCents) || amountCents <= 0) {
      throw new BadRequestException({
        code: BILLING_ERROR_CODE.BILLING_INVALID_AMOUNT,
        detail: 'amountUsd is invalid.',
      });
    }

    const frontendUrl = this.stripeContext.requireFrontendUrl();
    const successUrl = `${frontendUrl}/dashboard/settings/billing?topup=success`;
    const cancelUrl = `${frontendUrl}/dashboard/settings/billing?topup=cancel`;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer: stripeCustomerId,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Pytholit Credits',
              description: 'Pre-paid credits for usage-based billing (AI + compute).',
              metadata: { [StripeMetadataKey.IsCreditTopup]: 'true' },
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        metadata: { [StripeMetadataKey.IsCreditTopup]: 'true', billingAccountId, userId },
      },
      invoice_creation: {
        enabled: true,
        invoice_data: {
          metadata: { [StripeMetadataKey.IsCreditTopup]: 'true', billingAccountId, userId },
        },
      },
      metadata: { kind: 'credit_topup', billingAccountId, userId },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    if (!session.url) {
      throw new ServiceUnavailableException({
        code: BILLING_ERROR_CODE.STRIPE_CHECKOUT_FAILED,
        detail: 'Stripe checkout session did not return a URL.',
      });
    }

    return { url: session.url };
  }

  /** Creates Stripe Checkout subscription session for a paid plan. */
  async createCheckoutSession(
    userId: string,
    planId: PaidPlanId,
    interval: BillingInterval
  ): Promise<CheckoutSessionResponse> {
    if (!PAID_PLAN_IDS.includes(planId)) {
      throw new BadRequestException({
        code: BILLING_ERROR_CODE.BILLING_INVALID_PLAN,
        detail: 'Only paid plans can be purchased via checkout (pro/max).',
      });
    }
    if (!BILLING_INTERVALS.includes(interval)) {
      throw new BadRequestException({
        code: BILLING_ERROR_CODE.BILLING_INVALID_INTERVAL,
        detail: 'interval must be month or year.',
      });
    }

    const billingAccountId = userId;

    const state = await this.billingAccess.getStateForUser(userId);
    if (state.accessState === 'locked_due_to_payment') {
      const { url } = await this.createPortalSession(userId);
      return {
        status: 'requires_payment_method',
        requiresPaymentMethod: true,
        pendingPlanCode: planId,
        url,
      };
    }

    const planCode = buildBillingPlanCode(planId, interval);
    const { stripe, stripeCustomerId } = await this.stripeContext.getStripeContextForUser(userId);
    const existing = await this.stripeContext.getLatestStripeSubscription(stripe, stripeCustomerId);
    if (existing && (existing.status === 'active' || existing.status === 'trialing')) {
      const existingPlanCode = extractBillingPlanCodeFromSubscription(existing);
      if (existingPlanCode && existingPlanCode === planCode) {
        return { status: 'already_active', requiresPaymentMethod: false };
      }
    }

    const planCatalogVersion = getPlanCatalogVersion();
    const prices = await stripe.prices.list({
      lookup_keys: [planCode],
      active: true,
      limit: 10,
    });
    const selectedPrice = prices.data.find(p => {
      if (p.currency !== 'usd') return false;
      if (!p.recurring) return false;
      if (p.recurring.interval !== interval) return false;
      return true;
    });
    if (!selectedPrice) {
      throw new ServiceUnavailableException({
        code: BILLING_ERROR_CODE.BILLING_STRIPE_PRICE_NOT_CONFIGURED,
        detail: `No active Stripe price found for lookup_key=${planCode}.`,
      });
    }

    if (existing && existing.status !== 'canceled' && existing.status !== 'incomplete_expired') {
      const firstItem = existing.items?.data?.[0];
      if (!firstItem?.id) {
        const { url } = await this.createPortalSession(userId);
        return {
          requiresPaymentMethod: false,
          pendingPlanCode: planId,
          url,
        };
      }
      const existingPriceId = typeof firstItem.price?.id === 'string' ? firstItem.price.id : '';
      if (existingPriceId && existingPriceId === selectedPrice.id) {
        return { status: 'already_active', requiresPaymentMethod: false };
      }

      const returnUrl = `${this.stripeContext.requireFrontendUrl()}/dashboard/settings/billing`;
      const configurationId = await this.getOrCreatePortalConfigurationId(stripe);
      let session: Stripe.BillingPortal.Session;
      try {
        session = await stripe.billingPortal.sessions.create({
          customer: stripeCustomerId,
          return_url: returnUrl,
          configuration: configurationId,
          flow_data: {
            type: 'subscription_update_confirm',
            subscription_update_confirm: {
              subscription: existing.id,
              items: [{ id: firstItem.id, price: selectedPrice.id, quantity: 1 }],
            },
          },
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message.toLowerCase() : String(err).toLowerCase();
        if (message.includes('no changes to confirm')) {
          return { status: 'already_active', requiresPaymentMethod: false };
        }
        throw err;
      }

      if (!session.url) {
        throw new ServiceUnavailableException({
          code: BILLING_ERROR_CODE.STRIPE_PORTAL_FAILED,
          detail: 'Stripe upgrade confirmation did not return a URL.',
        });
      }

      return {
        requiresPaymentMethod: false,
        pendingPlanCode: planId,
        url: session.url,
      };
    }

    const frontendUrl = this.stripeContext.requireFrontendUrl();
    const successUrl = `${frontendUrl}/dashboard/settings/billing?setup=success&pendingPlanCode=${encodeURIComponent(planId)}`;
    const cancelUrl = `${frontendUrl}/dashboard/settings/billing?setup=cancel`;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: stripeCustomerId,
      line_items: [{ price: selectedPrice.id, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        kind: 'subscription',
        billingAccountId,
        planId,
        interval,
        planCode,
        planCatalogVersion: String(planCatalogVersion),
        engineSubscriptionExternalId: `sub_${userId}`,
      },
      subscription_data: {
        metadata: {
          billingAccountId,
          planId,
          interval,
          planCode,
          planCatalogVersion: String(planCatalogVersion),
          engineSubscriptionExternalId: `sub_${userId}`,
        },
      },
    });

    if (!session.url) {
      throw new ServiceUnavailableException({
        code: BILLING_ERROR_CODE.STRIPE_CHECKOUT_FAILED,
        detail: 'Stripe checkout session did not return a URL.',
      });
    }

    return { requiresPaymentMethod: false, pendingPlanCode: planId, url: session.url };
  }

  /** Finalizes client-side checkout flow after Stripe webhooks settle. */
  async finalizeCheckoutSession(
    userId: string,
    pendingPlanCode: PaidPlanId
  ): Promise<CheckoutSessionResponse> {
    if (!PAID_PLAN_IDS.includes(pendingPlanCode)) {
      throw new BadRequestException({
        code: BILLING_ERROR_CODE.BILLING_INVALID_PLAN,
        detail: 'pendingPlanCode must be pro or max.',
      });
    }

    const { stripe, stripeCustomerId } = await this.stripeContext.getStripeContextForUser(userId);
    const sub = await this.stripeContext.getLatestStripeSubscription(stripe, stripeCustomerId);
    if (!sub) {
      throw new ConflictException({
        code: BILLING_ERROR_CODE.BILLING_PROCESSING_UPGRADE,
        detail: 'No Stripe subscription is visible yet. Wait for webhooks and retry.',
      });
    }

    const planItem = pickPlanSubscriptionItem(sub);
    const itemPeriodStart = planItem?.currentPeriodStart ?? null;
    const itemPeriodEnd = planItem?.currentPeriodEnd ?? null;
    if (!planItem?.interval) {
      throw new ConflictException({
        code: BILLING_ERROR_CODE.BILLING_PROCESSING_UPGRADE,
        detail: 'Subscription is not ready yet (missing plan price item). Retry shortly.',
      });
    }
    if (!itemPeriodStart || !itemPeriodEnd) {
      throw new ConflictException({
        code: BILLING_ERROR_CODE.BILLING_PROCESSING_UPGRADE,
        detail: 'Subscription billing period is not available yet. Retry shortly.',
      });
    }

    const planCode = extractBillingPlanCodeFromSubscription(sub);
    if (!planCode) {
      throw new ConflictException({
        code: BILLING_ERROR_CODE.BILLING_PROCESSING_UPGRADE,
        detail: 'Subscription is missing plan code metadata. Retry shortly.',
      });
    }
    const planId: PlanId = planIdFromBillingPlanCode(planCode);

    if (planId !== pendingPlanCode) {
      throw new ConflictException({
        code: BILLING_ERROR_CODE.BILLING_PROCESSING_UPGRADE,
        detail: 'Stripe subscription is active, but plan mismatch. Retry shortly.',
      });
    }

    if (sub.status !== 'active' && sub.status !== 'trialing') {
      throw new ConflictException({
        code: BILLING_ERROR_CODE.BILLING_PROCESSING_UPGRADE,
        detail: `Subscription is ${sub.status}. Wait for webhooks and retry.`,
      });
    }

    return { status: 'activated', requiresPaymentMethod: false };
  }

  /**
   * Returns a Billing Portal configuration with subscription updates enabled.
   * Creates one when absent.
   */
  private async getOrCreatePortalConfigurationId(stripe: Stripe): Promise<string> {
    const subscriptionProducts = await this.getPortalSubscriptionUpdateProducts(stripe);
    const existing = await stripe.billingPortal.configurations.list({ active: true, limit: 20 });
    const managed = existing.data.find(
      config => (config.metadata?.managed_by ?? '') === 'pytholit'
    );
    if (managed?.id) {
      await stripe.billingPortal.configurations.update(managed.id, {
        features: {
          subscription_update: {
            enabled: true,
            default_allowed_updates: ['price'],
            billing_cycle_anchor: 'now',
            proration_behavior: 'always_invoice',
            schedule_at_period_end: {
              conditions: [
                { type: 'decreasing_item_amount' },
                { type: 'shortening_interval' },
              ],
            },
            trial_update_behavior: 'continue_trial',
            products: subscriptionProducts,
          },
        },
      });
      return managed.id;
    }

    const created = await stripe.billingPortal.configurations.create({
      business_profile: {
        headline: 'Manage your Pytholit subscription and billing',
      },
      default_return_url: `${this.stripeContext.requireFrontendUrl()}/dashboard/settings/billing`,
      features: {
        customer_update: {
          enabled: true,
          allowed_updates: ['email'],
        },
        invoice_history: { enabled: true },
        payment_method_update: { enabled: true },
        subscription_cancel: {
          enabled: true,
          mode: 'at_period_end',
          proration_behavior: 'none',
        },
        subscription_update: {
          enabled: true,
          default_allowed_updates: ['price'],
          billing_cycle_anchor: 'now',
          proration_behavior: 'always_invoice',
          schedule_at_period_end: {
            conditions: [
              { type: 'decreasing_item_amount' },
              { type: 'shortening_interval' },
            ],
          },
          trial_update_behavior: 'continue_trial',
          products: subscriptionProducts,
        },
      },
      metadata: {
        managed_by: 'pytholit',
      },
    });

    return created.id;
  }

  private async getPortalSubscriptionUpdateProducts(
    stripe: Stripe
  ): Promise<Stripe.BillingPortal.ConfigurationCreateParams.Features.SubscriptionUpdate.Product[]> {
    const expectedLookupKeys = PAID_PLAN_IDS.flatMap(planId =>
      BILLING_INTERVALS.map(interval => buildBillingPlanCode(planId, interval))
    );

    const prices = await stripe.prices.list({
      lookup_keys: expectedLookupKeys,
      active: true,
      limit: 100,
    });
    const recurringUsd = prices.data.filter(
      price =>
        price.currency === 'usd' && Boolean(price.recurring) && typeof price.product === 'string'
    );

    const byProduct = new Map<string, string[]>();
    for (const price of recurringUsd) {
      const productId = price.product as string;
      const existing = byProduct.get(productId) ?? [];
      if (!existing.includes(price.id)) existing.push(price.id);
      byProduct.set(productId, existing);
    }

    const products = Array.from(byProduct.entries()).map(([product, priceIds]) => ({
      product,
      prices: priceIds,
    }));

    if (products.length === 0) {
      throw new ServiceUnavailableException({
        code: BILLING_ERROR_CODE.BILLING_STRIPE_PRICE_NOT_CONFIGURED,
        detail: 'No active recurring Stripe prices found to configure portal subscription updates.',
      });
    }

    return products;
  }
}
