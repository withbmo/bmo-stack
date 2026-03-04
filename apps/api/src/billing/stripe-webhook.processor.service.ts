import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getPlanCatalogVersion } from '@pytholit/config';
import Stripe from 'stripe';

import { StripeWebhookHandler } from '../common/decorators/stripe-webhook-handler.decorator';
import { PrismaService } from '../database/prisma.service';
import { StripeService } from '../stripe/stripe.service';
import { BILLING_ERROR_CODE } from './billing-error-codes';
import {
  BILLING_ACCESS_STATE,
  type BillingAccessState,
  type BillingPlanCode,
} from './billing.interface';
import {
  getDefaultBillingPlanCode,
  isBillingPlanCode,
} from './billing-plan-code';
import { BillingStateService } from './billing-state.service';
import { StripeUsageService } from './stripe-usage.service';
import { StripeWebhookExplorerService } from './stripe-webhook-explorer.service';
import { sanitizeErrorForLog } from './utils/log-sanitize.utils';
import {
  extractBillingPlanCodeFromSubscription,
  extractPlanCatalogVersionFromSubscription,
} from './utils/stripe-plan-code.utils';

function isCreditTopupInvoice(invoice: Stripe.Invoice): boolean {
  const meta = (invoice.metadata ?? {}) as Record<string, string>;
  if (meta.is_credit_topup === 'true') return true;
  const lines = invoice.lines?.data ?? [];
  for (const line of lines) {
    const lm = (line.metadata ?? {}) as Record<string, string>;
    if (lm.is_credit_topup === 'true') return true;
  }
  return false;
}

function mapStripeStatusToAccessState(status: string | null | undefined): BillingAccessState {
  switch (status) {
    case 'active':
    case 'trialing':
      return BILLING_ACCESS_STATE.Enabled;
    case 'past_due':
    case 'unpaid':
    case 'incomplete':
      return BILLING_ACCESS_STATE.LockedDueToPayment;
    case 'incomplete_expired':
    case 'canceled':
    case 'paused':
      return BILLING_ACCESS_STATE.LockedNoSubscription;
    default:
      // Treat unknown statuses conservatively as enabled; we will lock via invoice failures anyway.
      return BILLING_ACCESS_STATE.Enabled;
  }
}

@Injectable()
export class StripeWebhookProcessorService {
  private readonly logger = new Logger(StripeWebhookProcessorService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly stripeService: StripeService,
    private readonly config: ConfigService,
    private readonly stripeUsage: StripeUsageService,
    private readonly billingState: BillingStateService,
    private readonly webhookExplorer: StripeWebhookExplorerService
  ) {}

  private isEnabled(flagName: string, defaultValue: boolean): boolean {
    const raw = this.config.get<boolean | string>(flagName);
    if (typeof raw === 'boolean') return raw;
    if (typeof raw === 'string') {
      const normalized = raw.trim().toLowerCase();
      if (normalized === 'true' || normalized === '1' || normalized === 'yes') return true;
      if (normalized === 'false' || normalized === '0' || normalized === 'no') return false;
    }
    return defaultValue;
  }

  async processStripeEvent(event: Stripe.Event): Promise<void> {
    try {
      await this.webhookExplorer.processWebhookEvent(event);
    } catch (err) {
      this.logger.error('stripe_webhook_processing_failed', {
        stripeEventId: event.id,
        type: event.type,
        message: sanitizeErrorForLog(err, 1000),
      });
      throw err;
    }
  }

  async processStripeEventAndUpdateStatus(
    stripeEventId: string,
    event: Stripe.Event,
    errorMessageMaxLength = 2000
  ): Promise<void> {
    try {
      await this.processStripeEvent(event);
      await this.prisma.client.stripeWebhookEvent.update({
        where: { stripeEventId },
        data: { processingStatus: 'processed', lastError: null },
        select: { stripeEventId: true },
      });
    } catch (err) {
      const message = sanitizeErrorForLog(err, errorMessageMaxLength);
      await this.prisma.client.stripeWebhookEvent.update({
        where: { stripeEventId },
        data: { processingStatus: 'failed', lastError: message },
        select: { stripeEventId: true },
      });
      throw err;
    }
  }

  private async ensureBillingState(input: {
    userId: string;
    planCode: BillingPlanCode;
    planCatalogVersion?: number | null;
    accessState: BillingAccessState;
    lockedReason?: string | null;
    lastStripeEventId?: string | null;
  }): Promise<void> {
    await this.billingState.upsertState({
      userId: input.userId,
      planCode: input.planCode,
      planCatalogVersion: input.planCatalogVersion,
      accessState: input.accessState,
      lockedReason: input.lockedReason,
      lastStripeEventId: input.lastStripeEventId,
    });
  }

  private async resolveUserIdFromStripeCustomerId(
    customerId: string
  ): Promise<{ userId: string } | null> {
    const user = await this.prisma.client.user.findUnique({
      where: { stripeCustomerId: customerId },
      select: { id: true },
    });
    if (!user?.id) return null;
    return { userId: user.id };
  }

  private async resolvePlanCodeFromState(userId: string): Promise<{
    planCode: BillingPlanCode;
    planCatalogVersion: number;
  }> {
    const state = await this.prisma.client.billingEngineState.findUnique({
      where: { userId },
      select: { planCode: true, planCatalogVersion: true },
    });
    if (!isBillingPlanCode(state?.planCode)) {
      throw new ServiceUnavailableException({
        code: BILLING_ERROR_CODE.BILLING_STATE_INVALID_PLAN_CODE,
        detail: `Invalid or missing plan code in billing state for user=${userId}.`,
      });
    }
    return {
      planCode: state.planCode,
      planCatalogVersion: state?.planCatalogVersion ?? getPlanCatalogVersion(),
    };
  }

  private extractSubscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
    const subRef = (invoice as unknown as { subscription?: unknown }).subscription ?? null;
    const direct =
      typeof subRef === 'string'
        ? subRef
        : subRef && typeof subRef === 'object' && 'id' in (subRef as Record<string, unknown>)
          ? String((subRef as { id?: unknown }).id ?? '')
          : null;
    if (direct) return direct;

    const parentSubRef = invoice.parent?.subscription_details?.subscription ?? null;
    return typeof parentSubRef === 'string'
      ? parentSubRef
      : parentSubRef && typeof parentSubRef === 'object' && 'id' in parentSubRef
        ? String((parentSubRef as { id?: unknown }).id ?? '')
        : null;
  }

  @StripeWebhookHandler([
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
  ])
  public async handleSubscriptionEvent(event: Stripe.Event): Promise<void> {
    const subscription = event.data.object as Stripe.Subscription;
    const stripeCustomerId =
      typeof subscription.customer === 'string' ? subscription.customer : null;
    if (!stripeCustomerId) {
      this.logger.warn('stripe_subscription_event_missing_customer', {
        stripeEventId: event.id,
        type: event.type,
        stripeSubscriptionId: subscription.id,
      });
      return;
    }

    const user = await this.resolveUserIdFromStripeCustomerId(stripeCustomerId);
    if (!user) {
      this.logger.warn('stripe_subscription_event_unmapped_customer', {
        stripeEventId: event.id,
        type: event.type,
        stripeCustomerId,
      });
      return;
    }

    const planCode = extractBillingPlanCodeFromSubscription(subscription);
    if (event.type !== 'customer.subscription.deleted' && !planCode) {
      throw new ServiceUnavailableException({
        code: BILLING_ERROR_CODE.BILLING_STRIPE_WEBHOOK_PLAN_CODE_MISSING,
        detail: `Missing plan code for subscription=${subscription.id} customer=${stripeCustomerId}.`,
      });
    }
    const planCatalogVersion =
      extractPlanCatalogVersionFromSubscription(subscription) ?? getPlanCatalogVersion();
    if (planCatalogVersion !== getPlanCatalogVersion()) {
      this.logger.warn('stripe_plan_catalog_version_mismatch', {
        userId: user.userId,
        stripeSubscriptionId: subscription.id,
        incomingVersion: planCatalogVersion,
        currentVersion: getPlanCatalogVersion(),
        note: 'Deprecated plan handling will be implemented with custom business logic later.',
      });
    }
    const accessState = mapStripeStatusToAccessState(subscription.status);

    if (event.type === 'customer.subscription.deleted') {
      await this.ensureBillingState({
        userId: user.userId,
        planCode: getDefaultBillingPlanCode(),
        planCatalogVersion: getPlanCatalogVersion(),
        accessState: BILLING_ACCESS_STATE.LockedNoSubscription,
        lockedReason: 'stripe_subscription_deleted',
        lastStripeEventId: event.id,
      });
      return;
    }

    await this.ensureBillingState({
      userId: user.userId,
      planCode: planCode as BillingPlanCode,
      planCatalogVersion,
      accessState,
      lockedReason:
        accessState === BILLING_ACCESS_STATE.Enabled
          ? null
          : `stripe_status:${subscription.status}`,
      lastStripeEventId: event.id,
    });
  }

  @StripeWebhookHandler([
    'invoice.payment_failed',
    'invoice.payment_action_required',
    'invoice.finalization_failed',
  ])
  public async handleInvoicePaymentIssue(event: Stripe.Event): Promise<void> {
    const stripe = this.stripeService.client();
    const invoice = event.data.object as Stripe.Invoice;
    const invoiceId = invoice.id;
    if (!invoiceId) {
      this.logger.warn('stripe_invoice_issue_missing_invoice_id', {
        stripeEventId: event.id,
        type: event.type,
      });
      return;
    }

    const fullInvoice = await stripe.invoices.retrieve(invoiceId);
    const customerId = typeof fullInvoice.customer === 'string' ? fullInvoice.customer : null;
    if (!customerId) {
      this.logger.warn('stripe_invoice_issue_missing_customer', {
        stripeEventId: event.id,
        type: event.type,
        invoiceId,
      });
      return;
    }

    const user = await this.resolveUserIdFromStripeCustomerId(customerId);
    if (!user) {
      this.logger.warn('stripe_invoice_issue_unmapped_customer', {
        stripeEventId: event.id,
        type: event.type,
        customerId,
      });
      return;
    }
    const existingState = await this.prisma.client.billingEngineState.findUnique({
      where: { userId: user.userId },
      select: { planCatalogVersion: true },
    });

    const subscriptionId = this.extractSubscriptionIdFromInvoice(fullInvoice);
    let planCodeFromInvoice: BillingPlanCode | null = null;
    if (subscriptionId) {
      const sub = await stripe.subscriptions.retrieve(subscriptionId);
      planCodeFromInvoice = extractBillingPlanCodeFromSubscription(sub);
    }
    if (!planCodeFromInvoice) {
      throw new ServiceUnavailableException({
        code: BILLING_ERROR_CODE.BILLING_STRIPE_WEBHOOK_PLAN_CODE_MISSING,
        detail: `Missing subscription plan code for invoice payment issue customer=${customerId} event=${event.type}.`,
      });
    }

    await this.ensureBillingState({
      userId: user.userId,
      planCode: planCodeFromInvoice,
      planCatalogVersion: existingState?.planCatalogVersion ?? getPlanCatalogVersion(),
      accessState: BILLING_ACCESS_STATE.LockedDueToPayment,
      lockedReason: `stripe_invoice_issue:${event.type}`,
      lastStripeEventId: event.id,
    });

    if (!subscriptionId) {
      this.logger.warn('stripe_invoice_issue_missing_subscription_ref', {
        stripeEventId: event.id,
        type: event.type,
        customerId,
      });
    }
  }

  @StripeWebhookHandler('invoice.paid')
  public async handleInvoicePaid(event: Stripe.Event): Promise<void> {
    const stripe = this.stripeService.client();
    const invoice = event.data.object as Stripe.Invoice;
    const invoiceId = invoice.id;
    if (!invoiceId) {
      this.logger.warn('stripe_invoice_paid_missing_invoice_id', {
        stripeEventId: event.id,
      });
      return;
    }

    const fullInvoice = await stripe.invoices.retrieve(invoiceId, { expand: ['lines.data'] });
    const customerId = typeof fullInvoice.customer === 'string' ? fullInvoice.customer : null;

    // Topup flow: credit the engine wallet, keyed by invoice id.
    if (isCreditTopupInvoice(fullInvoice)) {
      if (!customerId) {
        this.logger.warn('stripe_topup_missing_customer', {
          stripeEventId: event.id,
          invoiceId,
        });
        return;
      }

      const meta = (fullInvoice.metadata ?? {}) as Record<string, string>;
      const userId = typeof meta.userId === 'string' ? meta.userId : null;
      if (!userId) {
        this.logger.warn('stripe_topup_missing_userId', { invoiceId });
        return;
      }

      const useStripeCredits = this.isEnabled('BILLING_USE_STRIPE_CREDITS', true);
      if (!useStripeCredits) {
        throw new ServiceUnavailableException({
          code: BILLING_ERROR_CODE.BILLING_ENGINE_ERROR,
          detail: 'Stripe credit grants are disabled by configuration.',
        });
      }

      const user = await this.prisma.client.user.findUnique({
        where: { id: userId },
        select: { id: true, stripeCustomerId: true },
      });
      if (!user?.id) {
        this.logger.warn('stripe_topup_user_missing_or_incomplete', {
          stripeEventId: event.id,
          invoiceId,
          userId,
        });
        return;
      }
      if (user.stripeCustomerId !== customerId) {
        throw new ServiceUnavailableException({
          code: BILLING_ERROR_CODE.BILLING_STRIPE_TOPUP_CUSTOMER_MISMATCH,
          detail: `Topup invoice customer does not match metadata user (${userId}).`,
        });
      }

      const amountPaidCents = fullInvoice.amount_paid ?? null;
      const currency = (fullInvoice.currency ?? 'usd').toLowerCase();
      if (currency !== 'usd') {
        this.logger.warn('stripe_topup_unsupported_currency', {
          stripeEventId: event.id,
          invoiceId,
          currency,
        });
        return;
      }
      if (typeof amountPaidCents !== 'number' || amountPaidCents <= 0) {
        this.logger.warn('stripe_topup_invalid_amount', {
          stripeEventId: event.id,
          invoiceId,
          amountPaidCents,
        });
        return;
      }

      await this.stripeUsage.grantCredits({
        stripeCustomerId: customerId,
        amountUsd: amountPaidCents / 100,
        idempotencyKey: invoiceId,
      });

      // If the only lock reason was wallet depletion, unlock on successful topup.
      const state = await this.prisma.client.billingEngineState.findUnique({
        where: { userId: user.id },
        select: { accessState: true, planCode: true, planCatalogVersion: true },
      });
      if (state?.accessState === BILLING_ACCESS_STATE.LockedWalletDepleted) {
        if (!isBillingPlanCode(state.planCode)) {
          throw new ServiceUnavailableException({
            code: BILLING_ERROR_CODE.BILLING_STATE_INVALID_PLAN_CODE,
            detail: `Invalid plan code in billing state for user=${user.id}.`,
          });
        }
        await this.ensureBillingState({
          userId: user.id,
          planCode: state.planCode,
          planCatalogVersion: state.planCatalogVersion ?? getPlanCatalogVersion(),
          accessState: BILLING_ACCESS_STATE.Enabled,
          lockedReason: null,
          lastStripeEventId: event.id,
        });
      }
      return;
    }

    // Subscription invoice paid: unlock if previously locked due to payment.
    if (!customerId) {
      this.logger.warn('stripe_invoice_paid_missing_customer', {
        stripeEventId: event.id,
        invoiceId,
      });
      return;
    }
    const user = await this.resolveUserIdFromStripeCustomerId(customerId);
    if (!user) {
      this.logger.warn('stripe_invoice_paid_unmapped_customer', {
        stripeEventId: event.id,
        customerId,
      });
      return;
    }

    const state = await this.prisma.client.billingEngineState.findUnique({
      where: { userId: user.userId },
      select: { planCode: true, accessState: true, planCatalogVersion: true },
    });
    if (state?.accessState === BILLING_ACCESS_STATE.LockedDueToPayment) {
      if (!isBillingPlanCode(state.planCode)) {
        throw new ServiceUnavailableException({
          code: BILLING_ERROR_CODE.BILLING_STATE_INVALID_PLAN_CODE,
          detail: `Invalid plan code in billing state for user=${user.userId}.`,
        });
      }
      await this.ensureBillingState({
        userId: user.userId,
        planCode: state.planCode,
        planCatalogVersion: state.planCatalogVersion ?? getPlanCatalogVersion(),
        accessState: BILLING_ACCESS_STATE.Enabled,
        lockedReason: null,
        lastStripeEventId: event.id,
      });
    }
  }

  @StripeWebhookHandler(['charge.refunded', 'charge.dispute.created'])
  public async handleChargeRiskEvent(event: Stripe.Event): Promise<void> {
    const stripe = this.stripeService.client();
    let customerId: string | null = null;

    if (event.type === 'charge.refunded') {
      const charge = event.data.object as Stripe.Charge;
      customerId = typeof charge.customer === 'string' ? charge.customer : null;
    }

    if (event.type === 'charge.dispute.created') {
      const dispute = event.data.object as Stripe.Dispute;
      const chargeRef = dispute.charge;
      const chargeId =
        typeof chargeRef === 'string'
          ? chargeRef
          : chargeRef && typeof chargeRef === 'object'
            ? String(chargeRef.id ?? '')
            : '';
      if (chargeId) {
        const charge = await stripe.charges.retrieve(chargeId);
        customerId = typeof charge.customer === 'string' ? charge.customer : null;
      }
    }

    if (!customerId) {
      this.logger.warn('stripe_charge_risk_event_missing_customer', {
        stripeEventId: event.id,
        type: event.type,
      });
      return;
    }

    const user = await this.resolveUserIdFromStripeCustomerId(customerId);
    if (!user) {
      this.logger.warn('stripe_charge_risk_event_unmapped_customer', {
        stripeEventId: event.id,
        type: event.type,
        customerId,
      });
      return;
    }

    const state = await this.resolvePlanCodeFromState(user.userId);
    await this.ensureBillingState({
      userId: user.userId,
      planCode: state.planCode,
      planCatalogVersion: state.planCatalogVersion,
      accessState: BILLING_ACCESS_STATE.LockedDueToPayment,
      lockedReason: `stripe_charge_issue:${event.type}`,
      lastStripeEventId: event.id,
    });
  }
}
