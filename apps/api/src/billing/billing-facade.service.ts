import {
  BadRequestException,
  ConflictException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getPlanCatalogVersion } from '@pytholit/config';
import {
  BILLING_INTERVAL,
  BILLING_INTERVALS,
  type BillingInterval,
  type CheckoutSessionResponse,
  type InvoiceListResponse,
  PAID_PLAN_IDS,
  type PaidPlanId,
  type Plan,
  PLAN_ID,
  type PlanId,
  type Subscription,
} from '@pytholit/contracts';
import type Stripe from 'stripe';

import { StripeService } from '../stripe/stripe.service';
import { BillingAccessService } from './billing-access.service';
import { BILLING_ERROR_CODE } from './billing-error-codes';
import {
  buildBillingPlanCode,
  parseBillingPlanCode,
  planIdFromBillingPlanCode,
} from './billing-plan-code';
import { BillingPlansService } from './billing-plans.service';
import { StripeCustomerService } from './stripe-customer.service';
import { StripeWebhookService } from './stripe-webhook.service';
import { extractBillingPlanCodeFromSubscription } from './utils/stripe-plan-code.utils';

type StripeSubscriptionWithPeriods = Stripe.Subscription & {
  current_period_start?: number;
  current_period_end?: number;
  cancel_at_period_end?: boolean;
};

function pickPlanSubscriptionItem(subscription: Stripe.Subscription): {
  priceId: string;
  interval: BillingInterval;
  currentPeriodStart: number | null;
  currentPeriodEnd: number | null;
} | null {
  const items = subscription.items?.data ?? [];
  for (const item of items) {
    const price = item?.price ?? null;
    const priceId = price?.id ?? null;
    const interval = price?.recurring?.interval ?? null;
    if (!priceId) {
      throw new ConflictException({
        code: BILLING_ERROR_CODE.BILLING_STRIPE_SUBSCRIPTION_ITEM_INVALID,
        detail: 'Subscription item is missing Stripe price id.',
      });
    }
    if (!interval || !BILLING_INTERVALS.includes(interval as BillingInterval)) {
      throw new ConflictException({
        code: BILLING_ERROR_CODE.BILLING_STRIPE_SUBSCRIPTION_ITEM_INVALID,
        detail: `Subscription item has invalid interval "${String(interval)}".`,
      });
    }
    const billingInterval = interval as BillingInterval;
    return {
      priceId,
      interval: billingInterval,
      currentPeriodStart:
        typeof item?.current_period_start === 'number' ? item.current_period_start : null,
      currentPeriodEnd:
        typeof item?.current_period_end === 'number' ? item.current_period_end : null,
    };
  }
  return null;
}

@Injectable()
export class BillingFacadeService {
  constructor(
    private readonly config: ConfigService,
    private readonly plans: BillingPlansService,
    private readonly billingAccess: BillingAccessService,
    private readonly stripeWebhook: StripeWebhookService,
    private readonly stripeService: StripeService,
    private readonly stripeCustomers: StripeCustomerService
  ) {}

  /** Returns billing plans loaded from local JSON config. */
  getPlans(): Plan[] {
    return this.plans.getPlans();
  }

  /**
   * Returns user subscription view by combining:
   * - local billing state snapshot (access state + plan code), and
   * - latest Stripe subscription (for period/status details).
   */
  async getSubscriptionResponse(userId: string): Promise<{
    subscription: Subscription | null;
  }> {
    const state = await this.billingAccess.getStateForUser(userId);
    const planFromEngine = parseBillingPlanCode(state.planCode);
    if (!planFromEngine) {
      throw new ServiceUnavailableException({
        code: BILLING_ERROR_CODE.BILLING_STATE_INVALID_PLAN_CODE,
        detail: `Unknown billing plan code in state: ${state.planCode}`,
      });
    }
    const featureAccessState: Subscription['featureAccessState'] =
      state.accessState === 'locked_due_to_payment' ||
      state.accessState === 'locked_wallet_depleted'
        ? 'locked_due_to_payment'
        : 'enabled';

    const { stripe, stripeCustomerId } = await this.getStripeContextForUser(userId);
    const sub = await this.getLatestStripeSubscription(stripe, stripeCustomerId);
    if (!sub) {
      if (planFromEngine.planId === PLAN_ID.FREE) return { subscription: null };

      const periodStart = new Date();
      const periodEnd = new Date(periodStart);
      if (planFromEngine.billingInterval === BILLING_INTERVAL.YEAR) {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      } else {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      }
      const publicPlan = this.findPlanById(planFromEngine.planId);
      return {
        subscription: {
          id: `sub_${userId}`,
          planId: planFromEngine.planId,
          billingInterval: planFromEngine.billingInterval,
          status: featureAccessState === 'locked_due_to_payment' ? 'past_due' : 'active',
          featureAccessState,
          walletCreditsUsable: false,
          periodStart: periodStart.toISOString(),
          periodEnd: periodEnd.toISOString(),
          cancelAtPeriodEnd: false,
          plan: publicPlan,
        },
      };
    }

    const planId: PlanId = planFromEngine.planId;
    const billingInterval: BillingInterval = planFromEngine.billingInterval;
    const publicPlan = this.findPlanById(planId);

    const stripeSub = sub as StripeSubscriptionWithPeriods;
    const startSec = stripeSub.current_period_start;
    const endSec = stripeSub.current_period_end;
    const periodStart = typeof startSec === 'number' ? new Date(startSec * 1000) : new Date();
    const periodEnd = typeof endSec === 'number' ? new Date(endSec * 1000) : new Date();

    return {
      subscription: {
        id: sub.id,
        planId,
        billingInterval,
        status: (sub.status ?? 'active') as Subscription['status'],
        featureAccessState: featureAccessState,
        walletCreditsUsable: false,
        periodStart: periodStart.toISOString(),
        periodEnd: periodEnd.toISOString(),
        cancelAtPeriodEnd: Boolean(stripeSub.cancel_at_period_end),
        plan: publicPlan,
      },
    };
  }

  /** Returns Stripe invoices for a user with cursor pagination (`starting_after`). */
  async getInvoices(
    userId: string,
    limit = 25,
    startingAfter?: string
  ): Promise<InvoiceListResponse> {
    const { stripe, stripeCustomerId } = await this.getStripeContextForUser(userId);
    const normalizedLimit = Math.max(1, Math.min(100, Math.floor(limit)));
    const normalizedStartingAfter = (startingAfter ?? '').trim();
    const invoices = await stripe.invoices.list({
      customer: stripeCustomerId,
      limit: normalizedLimit,
      starting_after: normalizedStartingAfter || undefined,
    });
    const lastInvoice = invoices.data[invoices.data.length - 1] ?? null;

    return {
      items: invoices.data.map(inv => {
        return {
          id: inv.id,
          number: inv.number ?? inv.id,
          amountCents: inv.amount_due ?? inv.amount_paid ?? 0,
          currency: 'USD',
          status: inv.status ?? 'open',
          issuingDate: inv.created ? new Date(inv.created * 1000).toISOString() : undefined,
          paymentDueDate: inv.due_date ? new Date(inv.due_date * 1000).toISOString() : undefined,
          pdfUrl: inv.invoice_pdf ?? undefined,
        };
      }),
      hasMore: invoices.has_more,
      nextCursor: invoices.has_more && lastInvoice?.id ? lastInvoice.id : undefined,
    };
  }

  /** Creates Stripe Billing Portal session for payment-method management. */
  async createPortalSession(userId: string): Promise<{ url: string }> {
    const { stripe, stripeCustomerId } = await this.getStripeContextForUser(userId);

    const returnUrl = `${this.requireFrontendUrl()}/dashboard/settings/billing`;
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl,
    });

    if (!session.url) {
      throw new ServiceUnavailableException({
        code: BILLING_ERROR_CODE.STRIPE_PORTAL_FAILED,
        detail: 'Stripe portal session did not return a URL.',
      });
    }

    return { url: session.url };
  }

  /** Creates Stripe Checkout payment session for one-off wallet top-up. */
  async createCreditTopupSession(userId: string, amountUsd: number): Promise<{ url: string }> {
    const billingAccountId = userId;
    const { stripe, stripeCustomerId } = await this.getStripeContextForUser(userId);

    const amountCents = Math.round(Number(amountUsd) * 100);
    if (!Number.isFinite(amountCents) || !Number.isInteger(amountCents) || amountCents <= 0) {
      throw new BadRequestException({
        code: BILLING_ERROR_CODE.BILLING_INVALID_AMOUNT,
        detail: 'amountUsd is invalid.',
      });
    }

    const successUrl = `${this.requireFrontendUrl()}/dashboard/settings/billing?topup=success`;
    const cancelUrl = `${this.requireFrontendUrl()}/dashboard/settings/billing?topup=cancel`;

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
              metadata: { is_credit_topup: 'true' },
            },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        metadata: { is_credit_topup: 'true', billingAccountId, userId },
      },
      invoice_creation: {
        enabled: true,
        invoice_data: {
          metadata: { is_credit_topup: 'true', billingAccountId, userId },
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

    const { stripe, stripeCustomerId } = await this.getStripeContextForUser(userId);
    const existing = await this.getLatestStripeSubscription(stripe, stripeCustomerId);
    if (existing) {
      if (existing.status === 'active' || existing.status === 'trialing') {
        const existingPlanCode = extractBillingPlanCodeFromSubscription(existing);
        if (!existingPlanCode) {
          throw new ConflictException({
            code: BILLING_ERROR_CODE.BILLING_PROCESSING_UPGRADE,
            detail: 'Subscription is missing plan code metadata. Retry shortly.',
          });
        }
        if (existingPlanCode === buildBillingPlanCode(planId, interval)) {
          return { status: 'already_active', requiresPaymentMethod: false };
        }
      }

      // Existing subscription (any other status): use portal to self-serve changes.
      if (existing.status !== 'canceled' && existing.status !== 'incomplete_expired') {
        const { url } = await this.createPortalSession(userId);
        return {
          requiresPaymentMethod: false,
          pendingPlanCode: planId,
          url,
        };
      }
    }

    const planCode = buildBillingPlanCode(planId, interval);
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

    const successUrl = `${this.requireFrontendUrl()}/dashboard/settings/billing?setup=success&pendingPlanCode=${encodeURIComponent(planId)}`;
    const cancelUrl = `${this.requireFrontendUrl()}/dashboard/settings/billing?setup=cancel`;

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

    const { stripe, stripeCustomerId } = await this.getStripeContextForUser(userId);
    const sub = await this.getLatestStripeSubscription(stripe, stripeCustomerId);
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

  /** Receives raw Stripe webhook payload and delegates signature/processing logic. */
  async receiveStripeWebhook(rawBody: Buffer, signatureHeader: string | undefined): Promise<void> {
    return this.stripeWebhook.receiveWebhook(rawBody, signatureHeader);
  }

  /** Returns shared Stripe context for user-scoped billing actions. */
  private async getStripeContextForUser(
    userId: string
  ): Promise<{ stripe: Stripe; stripeCustomerId: string }> {
    const stripeCustomerId = await this.stripeCustomers.getOrCreateStripeCustomerIdForUser(userId);
    return { stripe: this.stripeService.client(), stripeCustomerId };
  }

  /** Returns newest Stripe subscription for customer, or `null` if none exists. */
  private async getLatestStripeSubscription(
    stripe: Stripe,
    stripeCustomerId: string
  ): Promise<Stripe.Subscription | null> {
    const statusPriority: Record<string, number> = {
      active: 0,
      trialing: 1,
      past_due: 2,
      unpaid: 3,
      incomplete: 4,
      paused: 5,
      canceled: 6,
      incomplete_expired: 7,
    };

    const subs = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'all',
      limit: 20,
    });
    const sorted = [...subs.data].sort((a, b) => {
      const aPriority = statusPriority[a.status] ?? 99;
      const bPriority = statusPriority[b.status] ?? 99;
      if (aPriority !== bPriority) return aPriority - bPriority;
      return (b.created ?? 0) - (a.created ?? 0);
    });
    return sorted[0] ?? null;
  }

  /** Finds a local plan definition by id. */
  private findPlanById(planId: PlanId): Plan | null {
    return this.plans.getPlans().find(p => p.id === planId) ?? null;
  }

  /** Resolves and validates `FRONTEND_URL` used by Stripe redirect flows. */
  private requireFrontendUrl(): string {
    const url = (this.config.get<string>('FRONTEND_URL') ?? '').trim();
    if (!url) {
      throw new ServiceUnavailableException({
        code: BILLING_ERROR_CODE.FRONTEND_URL_NOT_CONFIGURED,
        detail: 'FRONTEND_URL is required for Stripe redirects.',
      });
    }
    return url.replace(/\/+$/, '');
  }
}
