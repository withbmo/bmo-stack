import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { getPlanRank as getConfigPlanRank } from '@pytholit/config';
import {
  BILLING_INTERVAL,
  type BillingInterval,
  type Plan,
  PLAN_ID,
  type PlanId,
  type Subscription,
} from '@pytholit/contracts';
import type Stripe from 'stripe';

import { BillingAccessService } from './billing-access.service';
import { BILLING_ERROR_CODE } from './billing-error-codes';
import { parseBillingPlanCode } from './billing-plan-code';
import { BillingPlansService } from './billing-plans.service';
import { StripeContextService } from './stripe-context.service';
import { extractBillingPlanCodeFromSubscription } from './utils/stripe-plan-code.utils';
import {
  pickPlanSubscriptionItem,
  type StripeSubscriptionWithPeriods,
} from './utils/stripe-subscription-item.utils';

@Injectable()
export class StripeSubscriptionReaderService {
  private readonly logger = new Logger(StripeSubscriptionReaderService.name);

  constructor(
    private readonly stripeContext: StripeContextService,
    private readonly billingAccess: BillingAccessService,
    private readonly plans: BillingPlansService
  ) {}

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

    const { stripe, stripeCustomerId } = await this.stripeContext.getStripeContextForUser(userId);
    const sub = await this.stripeContext.getLatestStripeSubscription(stripe, stripeCustomerId);
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

    const stripePlanCode = extractBillingPlanCodeFromSubscription(sub);
    const parsedStripePlan = stripePlanCode ? parseBillingPlanCode(stripePlanCode) : null;
    const resolvedPlan = parsedStripePlan ?? planFromEngine;
    const planId: PlanId = resolvedPlan.planId;
    const billingInterval: BillingInterval = resolvedPlan.billingInterval;
    const publicPlan = this.findPlanById(planId);

    const stripeSub = sub as StripeSubscriptionWithPeriods;
    const planItem = pickPlanSubscriptionItem(sub);
    const startSec = stripeSub.current_period_start ?? planItem?.currentPeriodStart ?? undefined;
    const endSec = stripeSub.current_period_end ?? planItem?.currentPeriodEnd ?? undefined;
    const periodStart = typeof startSec === 'number' ? new Date(startSec * 1000) : new Date();
    const periodEnd = typeof endSec === 'number' ? new Date(endSec * 1000) : new Date();
    const nowSec = Math.floor(Date.now() / 1000);
    const hasFutureCancelAt =
      typeof stripeSub.cancel_at === 'number' && stripeSub.cancel_at > nowSec;
    const scheduleId = this.getSubscriptionScheduleId(sub);
    const scheduleCancelsAtPeriodEnd = scheduleId
      ? await this.isScheduleSetToCancelAtPeriodEnd(stripe, scheduleId)
      : false;
    const cancelAtPeriodEnd =
      Boolean(stripeSub.cancel_at_period_end) || hasFutureCancelAt || scheduleCancelsAtPeriodEnd;
    const scheduledDowngrade = cancelAtPeriodEnd
      ? null
      : await this.resolveScheduledDowngrade({
          stripe,
          subscription: sub,
          currentPlanId: planId,
          effectiveAt: periodEnd.toISOString(),
        });

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
        cancelAtPeriodEnd,
        scheduledDowngrade,
        plan: publicPlan,
      },
    };
  }

  private async resolveScheduledDowngrade(input: {
    stripe: Stripe;
    subscription: Stripe.Subscription;
    currentPlanId: PlanId;
    effectiveAt: string;
  }): Promise<Subscription['scheduledDowngrade']> {
    try {
      const pendingPlanCode = await this.extractPendingPlanCodeFromSubscription(
        input.stripe,
        input.subscription
      );
      if (!pendingPlanCode) return null;
      const parsed = parseBillingPlanCode(pendingPlanCode);
      if (!parsed) return null;
      const pendingRank = getConfigPlanRank(parsed.planId);
      const currentRank = getConfigPlanRank(input.currentPlanId);
      if (pendingRank === null || currentRank === null) return null;
      if (pendingRank >= currentRank) return null;
      return {
        planId: parsed.planId,
        billingInterval: parsed.billingInterval,
        effectiveAt: input.effectiveAt,
      };
    } catch (err) {
      this.logger.warn('stripe_scheduled_change_resolve_failed', {
        stripeSubscriptionId: input.subscription.id,
        message: err instanceof Error ? err.message : String(err),
      });
      return null;
    }
  }

  private async extractPendingPlanCodeFromSubscription(
    stripe: Stripe,
    subscription: Stripe.Subscription
  ): Promise<string | null> {
    const pendingUpdate = (
      subscription as Stripe.Subscription & {
        pending_update?: {
          subscription_items?: Array<{
            price?: string | Stripe.Price | null;
          }>;
        } | null;
      }
    ).pending_update;
    const pendingPrice = pendingUpdate?.subscription_items?.[0]?.price ?? null;
    const pendingFromUpdate = await this.extractPlanCodeFromPriceRef(stripe, pendingPrice);
    if (pendingFromUpdate) return pendingFromUpdate;

    const scheduleRef = (
      subscription as Stripe.Subscription & { schedule?: string | Stripe.SubscriptionSchedule | null }
    ).schedule;
    const scheduleId =
      typeof scheduleRef === 'string'
        ? scheduleRef
        : scheduleRef && typeof scheduleRef === 'object'
          ? scheduleRef.id
          : '';
    if (!scheduleId) return null;

    const schedule = await stripe.subscriptionSchedules.retrieve(scheduleId, {
      expand: ['phases.items.price'],
    });
    const now = Math.floor(Date.now() / 1000);
    const nextPhase =
      schedule.phases.find(phase => typeof phase.start_date === 'number' && phase.start_date > now) ??
      schedule.phases[schedule.phases.length - 1];
    if (!nextPhase) return null;
    const nextPrice = nextPhase.items?.[0]?.price ?? null;
    return this.extractPlanCodeFromPriceRef(stripe, nextPrice);
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

  private async isScheduleSetToCancelAtPeriodEnd(
    stripe: Stripe,
    scheduleId: string
  ): Promise<boolean> {
    const schedule = await stripe.subscriptionSchedules.retrieve(scheduleId);
    return schedule.end_behavior === 'cancel';
  }

  private async extractPlanCodeFromPriceRef(
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

  private findPlanById(planId: PlanId): Plan | null {
    return this.plans.getPlans().find(p => p.id === planId) ?? null;
  }
}
