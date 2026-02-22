import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { getDefaultPlan, getPlanById, getPlanCredits, getPlans } from '@pytholit/config';
import type {
  Plan as ApiPlan,
  PlanChangeApplyResponse,
  PlanChangePreviewResponse,
  PublicPlan,
  Subscription as ApiSubscription,
} from '@pytholit/contracts';

import { PrismaService } from '../database/prisma.service';
import { BillingConfigService } from './billing.config';
import type { PaymentMethodResponse, ValidatePaymentMethodResult } from './billing.types';
import { LagoService } from './lago.service';
import type { LagoSubscription } from './lago.types';

type ConfigPlan = ReturnType<typeof getDefaultPlan>;

/**
 * BillingFacadeService
 *
 * High-level billing API that consolidates Lago (subscriptions, metering, invoicing)
 * and Stripe (payment methods) operations.
 *
 * This facade simplifies controller logic by providing single methods for complex
 * multi-service operations like checkout, subscription management, and limits checking.
 *
 * Benefits:
 * - Single injection point for all billing operations
 * - Centralized error handling and logging
 * - Reduced code duplication across controllers
 * - Cleaner separation of concerns
 */

export type CheckoutResult = {
  status?: 'activated' | 'already_active' | 'requires_payment_method' | 'failed';
  subscription?: {
    id: string;
    planCode: string;
    status: string;
  };
  paymentSetupUrl?: string;
  requiresPaymentMethod: boolean;
  pendingPlanCode?: string;
  url?: string;
};

export type SubscriptionDetails = {
  id: string;
  planId: string;
  billingInterval: 'month' | 'year';
  status: string;
  featureAccessState: 'enabled' | 'locked_due_to_payment';
  walletCreditsUsable: boolean;
  periodStart: Date;
  periodEnd: Date;
  cancelAtPeriodEnd: boolean;
};

export type FeatureLimit = {
  id: string;
  name: string;
  limit: number | 'unlimited';
  used: number;
  remaining: number | 'unlimited';
  percentage: number;
};

export type EntitlementLimitsResult = {
  planId: string;
  planName: string;
  periodStart: Date;
  periodEnd: Date;
  features: FeatureLimit[];
};

export type InvoiceListResult = {
  items: Array<{
    id: string;
    number: string;
    status: string;
    amountCents: number;
    currency: 'USD';
    issuingDate?: Date;
    paymentDueDate?: Date;
    pdfUrl?: string;
  }>;
  hasMore: boolean;
};

type CreditTopupProcessResult = 'processed' | 'skipped' | 'failed';

@Injectable()
export class BillingFacadeService {
  private readonly logger = new Logger(BillingFacadeService.name);
  private readonly dunningLockedStatuses = new Set(['past_due', 'unpaid']);

  constructor(
    private readonly lago: LagoService,
    private readonly prisma: PrismaService,
    private readonly billingConfig: BillingConfigService,
  ) {}

  /**
   * Create a subscription checkout session
   *
   * Orchestrates:
   * 1. Create/get Lago customer
   * 2. Create Lago subscription
   * 3. Check if user needs payment method setup
   * 4. Create Stripe setup session if needed
   * 5. Update local database
   */
  async createCheckout(userId: string, planCode: string): Promise<CheckoutResult> {
    this.logger.log(`Creating checkout for user ${userId}, plan ${planCode}`);
    if (!this.billingConfig.shouldUseLago(userId)) {
      throw new BadRequestException('Billing checkout is not enabled for this account cohort');
    }

    const planId = this.extractPlanIdFromCode(planCode);
    const requestedPlan = getPlanById(planId);
    if (!requestedPlan || !requestedPlan.isActive) {
      throw new BadRequestException(`Unknown or inactive plan: ${planId}`);
    }

    const lagoPlan = await this.lago.getPlan(planCode);
    if (!lagoPlan) {
      throw new BadRequestException(
        `Plan ${planCode} is not available in Lago. Run plan migration before checkout.`
      );
    }

    // Create Lago customer if doesn't exist
    await this.lago.createCustomer(userId);

    const existingSubscription = await this.lago.getSubscription(userId);
    if (
      existingSubscription &&
      existingSubscription.plan_code === planCode &&
      ['active', 'trialing', 'past_due'].includes(existingSubscription.status)
    ) {
      await this.syncSubscriptionToDb(userId, existingSubscription);
      return {
        status: 'already_active',
        subscription: {
          id: existingSubscription.lago_id,
          planCode: existingSubscription.plan_code,
          status: existingSubscription.status,
        },
        requiresPaymentMethod: false,
        url: `${this.billingConfig.frontendUrl}/dashboard/settings/billing`,
      };
    }

    const paymentSetupUrl = await this.lago.regenerateCustomerCheckoutUrl(userId, planCode);

    return {
      status: 'requires_payment_method',
      requiresPaymentMethod: true,
      paymentSetupUrl,
      pendingPlanCode: planCode,
    };
  }

  async finalizeCheckout(userId: string, pendingPlanCode: string): Promise<CheckoutResult> {
    if (!this.billingConfig.shouldUseLago(userId)) {
      throw new BadRequestException('Billing checkout is not enabled for this account cohort');
    }
    const planId = this.extractPlanIdFromCode(pendingPlanCode);
    const requestedPlan = getPlanById(planId);
    if (!requestedPlan || !requestedPlan.isActive) {
      throw new BadRequestException(`Unknown or inactive plan: ${planId}`);
    }
    const lagoPlan = await this.lago.getPlan(pendingPlanCode);
    if (!lagoPlan) {
      throw new BadRequestException(
        `Plan ${pendingPlanCode} is not available in Lago. Run plan migration before checkout.`
      );
    }

    const hasProvider = await this.lago.hasCustomerPaymentProvider(userId);
    if (!hasProvider) {
      throw new BadRequestException(
        'Payment method setup is not completed yet. Please finish billing setup and try again.'
      );
    }

    const subscription = await this.finalizePlanCheckout(userId, pendingPlanCode);

    return {
      status: 'activated',
      requiresPaymentMethod: false,
      subscription: {
        id: subscription.lago_id,
        planCode: subscription.plan_code,
        status: subscription.status,
      },
      url: `${this.billingConfig.frontendUrl}/dashboard/settings/billing`,
    };
  }

  /**
   * Get subscription details with plan information
   */
  async getSubscription(userId: string): Promise<SubscriptionDetails | null> {
    if (!this.billingConfig.shouldUseLago(userId)) {
      return null;
    }
    const subscription = await this.lago.getSubscription(userId);

    if (!subscription) {
      return null;
    }

    // Extract plan ID from plan code (format: "planId_monthly" or "planId_yearly")
    const planId = this.extractPlanIdFromCode(subscription.plan_code);
    const walletCreditsUsable = true;
    const billingInterval = subscription.plan_code.endsWith('_yearly') ? 'year' : 'month';
    const featureAccessState = this.dunningLockedStatuses.has(subscription.status)
      ? 'locked_due_to_payment'
      : 'enabled';

    return {
      id: subscription.lago_id,
      planId,
      billingInterval,
      status: subscription.status,
      featureAccessState,
      walletCreditsUsable,
      periodStart: subscription.current_period_start
        ? new Date(subscription.current_period_start)
        : new Date(),
      periodEnd: subscription.current_period_end
        ? new Date(subscription.current_period_end)
        : new Date(),
      cancelAtPeriodEnd: subscription.ending_at != null,
    };
  }

  /**
   * Get entitlement limits with usage
   *
   * Uses Lago's plan data as the source of truth for limits
   */
  async getLimits(userId: string): Promise<EntitlementLimitsResult> {
    const subscription = await this.lago.getSubscription(userId);

    if (!subscription || !subscription.plan) {
      // Return default plan limits
      const defaultPlan = getDefaultPlan();
      return this.getDefaultLimits(userId, defaultPlan);
    }

    const features: FeatureLimit[] = [];

    // Map Lago charges to feature limits
    if (subscription.plan.charges) {
      for (const charge of subscription.plan.charges) {
        const maxUnits = charge.properties.max_units;
        const used = charge.current_usage ?? 0;

        let limit: number | 'unlimited';
        let remaining: number | 'unlimited';
        let percentage: number;

        if (maxUnits === null || maxUnits === undefined) {
          limit = 'unlimited';
          remaining = 'unlimited';
          percentage = 0;
        } else {
          limit = maxUnits;
          remaining = Math.max(0, maxUnits - used);
          percentage = maxUnits > 0 ? Math.round((used / maxUnits) * 100) : 0;
        }

        features.push({
          id: charge.billable_metric_code,
          name: charge.billable_metric_name || charge.billable_metric_code,
          limit,
          used,
          remaining,
          percentage,
        });
      }
    }

    return {
      planId: subscription.plan.code,
      planName: subscription.plan.name,
      periodStart: subscription.current_period_start
        ? new Date(subscription.current_period_start)
        : new Date(),
      periodEnd: subscription.current_period_end
        ? new Date(subscription.current_period_end)
        : new Date(),
      features,
    };
  }

  /**
   * Check if user can consume a feature
   */
  async canConsume(userId: string, featureId: string, amount: number): Promise<boolean> {
    if (amount <= 0) return false;

    const limits = await this.getLimits(userId);
    const feature = limits.features.find(f => f.id === featureId);

    if (!feature) {
      this.logger.warn(`Feature ${featureId} not found in plan for user ${userId}`);
      return false;
    }

    if (feature.limit === 'unlimited') return true;
    if (typeof feature.remaining !== 'number') return false;

    return feature.remaining >= amount;
  }

  /**
   * Record usage for a feature
   */
  async recordUsage(
    userId: string,
    featureId: string,
    amount: number,
    operationId: string
  ): Promise<void> {
    if (amount <= 0) {
      throw new Error('Usage amount must be positive');
    }

    await this.lago.sendEvent({
      transaction_id: `${featureId}:${userId}:${operationId}`,
      external_customer_id: userId,
      code: featureId,
      timestamp: Math.floor(Date.now() / 1000),
      properties: { amount },
    });

    this.logger.log(`Recorded usage for user ${userId}: ${featureId} = ${amount}`);
  }

  /**
   * Get user invoices
   */
  async getInvoices(userId: string, limit = 20): Promise<InvoiceListResult> {
    const invoices = await this.lago.getInvoices(userId);

    // Sort by date descending
    const sorted = invoices.sort((a, b) => {
      const dateA = a.issuing_date ? new Date(a.issuing_date).getTime() : 0;
      const dateB = b.issuing_date ? new Date(b.issuing_date).getTime() : 0;
      return dateB - dateA;
    });

    const limited = sorted.slice(0, limit);

    return {
      items: limited.map(invoice => ({
        id: invoice.lago_id,
        number: invoice.number,
        status: invoice.status,
        amountCents: invoice.total_amount_cents,
        currency: 'USD',
        issuingDate: invoice.issuing_date ? new Date(invoice.issuing_date) : undefined,
        paymentDueDate: invoice.payment_due_date ? new Date(invoice.payment_due_date) : undefined,
        pdfUrl: invoice.file_url ?? undefined,
      })),
      hasMore: sorted.length > limit,
    };
  }

  /**
   * Get wallet balance (prepaid credits)
   */
  async getWalletBalance(userId: string): Promise<number> {
    return this.lago.getWalletBalance(userId);
  }

  async registerCreditTopupRequest(
    userId: string,
    lagoInvoiceId: string,
    amountUsd: number,
    credits: number,
    idempotencyKey: string
  ): Promise<string> {
    const row = await this.prisma.client.creditTopupRequest.upsert({
      where: { lagoInvoiceId },
      create: {
        userId,
        lagoInvoiceId,
        amountUsd,
        credits,
        status: 'pending',
        idempotencyKey,
      },
      update: {
        userId,
        amountUsd,
        credits,
        idempotencyKey,
      },
    });
    return row.id;
  }

  async processPaidInvoiceTopup(lagoInvoiceId: string): Promise<CreditTopupProcessResult> {
    const request = await this.prisma.client.creditTopupRequest.findUnique({
      where: { lagoInvoiceId },
      select: { id: true, userId: true, credits: true, status: true },
    });

    if (!request) return 'skipped';
    if (request.status === 'succeeded' || request.status === 'processing') return 'skipped';

    const claim = await this.prisma.client.creditTopupRequest.updateMany({
      where: { id: request.id, status: 'pending' },
      data: { status: 'processing' },
    });
    if (claim.count === 0) {
      return 'skipped';
    }

    try {
      const wallet = await this.lago.getWallet(request.userId);
      if (wallet) {
        await this.lago.topUpWallet(wallet.lago_id, request.credits);
      } else {
        await this.lago.createWallet(request.userId, request.credits);
      }

      const balance = await this.lago.getWalletBalance(request.userId);
      await this.prisma.client.$transaction([
        this.prisma.client.creditTopupRequest.update({
          where: { id: request.id },
          data: { status: 'succeeded', grantedAt: new Date(), processedAt: new Date() },
        }),
        this.prisma.client.creditLedgerEntry.create({
          data: {
            userId: request.userId,
            type: 'topup',
            deltaCredits: request.credits,
            balanceAfter: Math.round(balance),
            currency: 'USD',
            referenceId: lagoInvoiceId,
            reasonCode: 'invoice_paid',
          },
        }),
      ]);
      return 'processed';
    } catch (error) {
      await this.prisma.client.creditTopupRequest.update({
        where: { id: request.id },
        data: {
          status: 'failed',
          processedAt: new Date(),
          failureCode: error instanceof Error ? error.name : 'topup_failed',
        },
      });
      this.logger.error(
        `Failed to apply paid invoice topup for invoice ${lagoInvoiceId}`,
        error instanceof Error ? error.stack : String(error)
      );
      return 'failed';
    }
  }

  async retryFailedCreditTopup(userId: string, lagoInvoiceId: string): Promise<CreditTopupProcessResult> {
    const request = await this.prisma.client.creditTopupRequest.findUnique({
      where: { lagoInvoiceId },
      select: { userId: true, status: true },
    });

    if (!request || request.userId !== userId) {
      throw new NotFoundException('Credit top-up request not found');
    }
    if (request.status === 'succeeded') {
      return 'skipped';
    }
    return this.processPaidInvoiceTopup(lagoInvoiceId);
  }

  /**
   * Create billing portal session for subscription management
   */
  async createPortalSession(userId: string): Promise<string> {
    if (!this.billingConfig.shouldUseLago(userId)) {
      throw new BadRequestException('Billing portal is not enabled for this account cohort');
    }
    return this.lago.getCustomerPortalUrl(userId);
  }

  /**
   * Get all active plans (public API)
   */
  async getActivePlans(): Promise<PublicPlan[]> {
    if (!this.billingConfig.lagoEnabled) {
      throw new ServiceUnavailableException('Lago billing is not configured');
    }

    const configPlans = getPlans();
    const lagoPlans = await this.lago.listPlans();

    const byCode = new Map(lagoPlans.map(plan => [plan.code, plan]));
    const merged = configPlans
      .map((plan) => {
        const monthly = byCode.get(`${plan.id}_monthly`);
        const yearly = byCode.get(`${plan.id}_yearly`);
        if (!monthly || !yearly) {
          return null;
        }

        const monthlyPrice = Math.max(0, Math.round(monthly.amount_cents / 100));
        const yearlyPrice = Math.max(0, Math.round(yearly.amount_cents / 100));

        return this.toPublicPlan({
          ...plan,
          monthlyPrice,
          yearlyPrice,
        });
      })
      .filter((plan): plan is NonNullable<typeof plan> => plan !== null);

    return merged.sort((a, b) => a.monthlyPriceCents - b.monthlyPriceCents);
  }

  /**
   * Get user's saved payment methods from Stripe
   */
  async getPaymentMethods(userId: string): Promise<PaymentMethodResponse[]> {
    this.logger.debug(`payment_methods_deprecated userId=${userId}`);
    return [];
  }

  /**
   * Validate that a payment method belongs to the user
   */
  async validatePaymentMethod(
    userId: string,
    paymentMethodId: string
  ): Promise<ValidatePaymentMethodResult> {
    this.logger.debug(
      `validate_payment_method_deprecated userId=${userId} paymentMethodId=${paymentMethodId}`
    );
    return { valid: false, error: 'This endpoint is deprecated. Use Lago checkout/portal flow.' };
  }

  /**
   * Private helper methods
   */

  private async syncSubscriptionToDb(userId: string, lagoSubscription: LagoSubscription) {
    const planId = this.extractPlanIdFromCode(lagoSubscription.plan_code);
    const billingInterval = lagoSubscription.plan_code.endsWith('_yearly') ? 'year' : 'month';
    const featureAccessState = this.dunningLockedStatuses.has(lagoSubscription.status)
      ? 'locked_due_to_payment'
      : 'enabled';

    await this.prisma.client.subscription.upsert({
      where: {
        externalSubscriptionId: lagoSubscription.lago_id,
      },
      create: {
        userId,
        planId,
        externalSubscriptionId: lagoSubscription.lago_id,
        status: lagoSubscription.status,
        billingInterval,
        featureAccessState,
        currentPeriodStart: lagoSubscription.current_period_start
          ? new Date(lagoSubscription.current_period_start)
          : new Date(),
        currentPeriodEnd: lagoSubscription.current_period_end
          ? new Date(lagoSubscription.current_period_end)
          : new Date(),
        cancelAtPeriodEnd: false,
      },
      update: {
        status: lagoSubscription.status,
        billingInterval,
        featureAccessState,
        currentPeriodStart: lagoSubscription.current_period_start
          ? new Date(lagoSubscription.current_period_start)
          : undefined,
        currentPeriodEnd: lagoSubscription.current_period_end
          ? new Date(lagoSubscription.current_period_end)
          : undefined,
      },
    });
  }

  private async finalizePlanCheckout(userId: string, planCode: string): Promise<LagoSubscription> {
    const existingSubscription = await this.lago.getSubscription(userId);
    if (
      existingSubscription &&
      existingSubscription.plan_code === planCode &&
      ['active', 'trialing', 'past_due'].includes(existingSubscription.status)
    ) {
      await this.syncSubscriptionToDb(userId, existingSubscription);
      return existingSubscription;
    }

    if (
      existingSubscription &&
      !['terminated', 'canceled', 'cancelled'].includes(existingSubscription.status)
    ) {
      await this.lago.terminateSubscription(existingSubscription.lago_id);
    }

    const subscription = await this.lago.createSubscription(userId, planCode);
    await this.syncSubscriptionToDb(userId, subscription);
    return subscription;
  }

  private extractPlanIdFromCode(planCode: string): string {
    // Plan code format: "planId_monthly" or "planId_yearly"
    const parts = planCode.split('_');
    return parts.slice(0, -1).join('_') || planCode;
  }

  private toApiPlan(plan: ConfigPlan | null): ApiPlan | null {
    if (!plan) return null;
    const monthlyPriceCents = Math.max(0, Math.round(plan.monthlyPrice * 100));
    const yearlyPriceCents = Math.max(0, Math.round(plan.yearlyPrice * 100));
    const yearlyDiscountPercent =
      monthlyPriceCents > 0
        ? Math.max(
            0,
            Math.round((1 - yearlyPriceCents / Math.max(1, monthlyPriceCents * 12)) * 100)
          )
        : 0;
    return {
      id: plan.id,
      name: plan.name,
      displayName: plan.displayName,
      description: plan.description ?? null,
      currency: 'USD',
      monthlyPriceCents,
      yearlyPriceCents,
      monthlyIncludedCredits: getPlanCredits(plan.id, 'month'),
      yearlyIncludedCredits: getPlanCredits(plan.id, 'year'),
      yearlyBonusCredits: plan.yearlyBonusCredits,
      yearlyDiscountPercent,
      features: plan.features ?? [],
      isActive: Boolean(plan.isActive),
    };
  }

  private toPublicPlan(plan: ConfigPlan | null): PublicPlan | null {
    return this.toApiPlan(plan);
  }

  private planPriceCents(plan: ConfigPlan, interval: 'month' | 'year'): number {
    return Math.round((interval === 'year' ? plan.yearlyPrice : plan.monthlyPrice) * 100);
  }

  async previewPlanChange(
    userId: string,
    targetPlanId: string,
    targetInterval: 'month' | 'year'
  ): Promise<PlanChangePreviewResponse> {
    const current = await this.lago.getSubscription(userId);
    if (!current) {
      throw new BadRequestException('No active subscription to change');
    }

    const currentPlanId = this.extractPlanIdFromCode(current.plan_code);
    const currentInterval: 'month' | 'year' = current.plan_code.endsWith('_yearly') ? 'year' : 'month';
    const currentPlan = getPlanById(currentPlanId);
    const nextPlan = getPlanById(targetPlanId);
    if (!currentPlan || !nextPlan) {
      throw new BadRequestException('Unknown plan');
    }

    const nowMs = Date.now();
    const startMs = current.current_period_start ? new Date(current.current_period_start).getTime() : nowMs;
    const endMs = current.current_period_end ? new Date(current.current_period_end).getTime() : nowMs;
    const total = Math.max(1, endMs - startMs);
    const remaining = Math.max(0, endMs - nowMs);
    const remainingRatio = Number((remaining / total).toFixed(6));

    const oldPriceCents = this.planPriceCents(currentPlan, currentInterval);
    const newPriceCents = this.planPriceCents(nextPlan, targetInterval);
    const prorationAmountCents = Math.round((newPriceCents - oldPriceCents) * remainingRatio);

    const oldIncludedCredits = getPlanCredits(currentPlan.id, currentInterval);
    const newIncludedCredits = getPlanCredits(nextPlan.id, targetInterval);
    const includedCreditsDelta = Math.round((newIncludedCredits - oldIncludedCredits) * remainingRatio);

    const previewId = `${userId}:${current.plan_code}:${targetPlanId}:${targetInterval}:${endMs}`;

    return {
      previewId,
      prorationAmountCents,
      currency: 'USD',
      creditDelta: includedCreditsDelta,
      includedCreditsDelta,
      effectiveAt: new Date().toISOString(),
      remainingRatio,
      oldPlan: {
        planId: currentPlan.id,
        interval: currentInterval,
        priceCents: oldPriceCents,
        includedCredits: oldIncludedCredits,
      },
      newPlan: {
        planId: nextPlan.id,
        interval: targetInterval,
        priceCents: newPriceCents,
        includedCredits: newIncludedCredits,
      },
    };
  }

  async applyPlanChange(
    userId: string,
    targetPlanId: string,
    targetInterval: 'month' | 'year',
    previewId: string
  ): Promise<PlanChangeApplyResponse> {
    const preview = await this.previewPlanChange(userId, targetPlanId, targetInterval);
    if (preview.previewId !== previewId) {
      throw new BadRequestException('Plan change preview is stale. Please refresh and try again.');
    }

    const planCode = `${targetPlanId}_${targetInterval === 'year' ? 'yearly' : 'monthly'}`;
    const checkout = await this.finalizeCheckout(userId, planCode);
    const snapshot = await this.getSubscription(userId);

    if (preview.includedCreditsDelta !== 0) {
      const balance = await this.lago.getWalletBalance(userId);
      await this.prisma.client.creditLedgerEntry.create({
        data: {
          userId,
          type: 'plan_proration',
          deltaCredits: preview.includedCreditsDelta,
          balanceAfter: Math.round(balance),
          currency: 'USD',
          referenceId: planCode,
          reasonCode: 'plan_change_proration',
        },
      });
    }

    return {
      status: checkout.status ?? 'activated',
      subscriptionSnapshot: snapshot ? this.toApiSubscription(snapshot) : null,
    };
  }

  private toApiSubscription(snapshot: SubscriptionDetails): ApiSubscription {
    return {
      id: snapshot.id,
      planId: snapshot.planId,
      billingInterval: snapshot.billingInterval,
      status: snapshot.status as ApiSubscription['status'],
      featureAccessState: snapshot.featureAccessState,
      walletCreditsUsable: snapshot.walletCreditsUsable,
      periodStart: snapshot.periodStart.toISOString(),
      periodEnd: snapshot.periodEnd.toISOString(),
      cancelAtPeriodEnd: snapshot.cancelAtPeriodEnd,
    };
  }

  private async getDefaultLimits(userId: string, plan: ConfigPlan): Promise<EntitlementLimitsResult> {
    const features: FeatureLimit[] = await Promise.all(
      plan.features.map(async (feature) => {
        const used = await this.lago.getCurrentUsage(userId, feature.id).catch(() => 0);

        if (feature.value === 'unlimited') {
          return {
            id: feature.id,
            name: feature.name,
            limit: 'unlimited' as const,
            used,
            remaining: 'unlimited' as const,
            percentage: 0,
          };
        }

        if (typeof feature.value !== 'number') {
          return {
            id: feature.id,
            name: feature.name,
            limit: 0,
            used,
            remaining: 0,
            percentage: 100,
          };
        }

        const remaining = Math.max(0, feature.value - used);
        const percentage = feature.value > 0 ? Math.round((used / feature.value) * 100) : 0;

        return {
          id: feature.id,
          name: feature.name,
          limit: feature.value,
          used,
          remaining,
          percentage,
        };
      })
    );

    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0));
    const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0));

    return {
      planId: plan.id,
      planName: plan.displayName,
      periodStart: start,
      periodEnd: end,
      features,
    };
  }
}
