import { ForbiddenException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { type Plan } from '@pytholit/contracts';

import { isPrismaUniqueViolation } from '../common/utils/prisma-error.utils';
import { PrismaService } from '../database/prisma.service';
import {
  BILLING_ACCESS_STATE,
  type BillingAccessState,
  type BillingPlanCode,
} from './billing.interface';
import { BILLING_ERROR_CODE } from './billing-error-codes';
import {
  getDefaultBillingPlanCode,
  isBillingPlanCode,
  planIdFromBillingPlanCode,
} from './billing-plan-code';
import { BillingPlansService } from './billing-plans.service';

/**
 * Billing access and limits resolver.
 *
 * Main entry point for runtime billing checks:
 * - reads lock state + plan code from `billing_engine_states`
 * - resolves numeric limits from local plan JSON config
 */
@Injectable()
export class BillingAccessService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly plans: BillingPlansService
  ) {}

  /**
   * Resolve a numeric limit by feature key from a plan.
   *
   * Throws when the feature is missing or not numeric.
   */
  private getLimitFromPlan(plan: Plan, limitKey: string): number {
    const feature = plan.features.find(f => f.id === limitKey);
    if (!feature) {
      throw new ServiceUnavailableException({
        code: BILLING_ERROR_CODE.BILLING_PLAN_LIMIT_NOT_FOUND,
        detail: `Limit key "${limitKey}" is not configured for plan "${plan.id}".`,
      });
    }
    if (feature.type !== 'number') {
      throw new ServiceUnavailableException({
        code: BILLING_ERROR_CODE.BILLING_PLAN_LIMIT_TYPE_INVALID,
        detail: `Feature "${limitKey}" in plan "${plan.id}" must be numeric, got "${feature.type}".`,
      });
    }
    return feature.value as number;
  }

  /**
   * Resolve a plan by id from loaded plan config.
   * Throws when no plans are loaded or the id is unknown.
   */
  private resolvePlanById(planId: string): Plan {
    const plans = this.plans.getPlans();
    if (plans.length === 0) {
      throw new ServiceUnavailableException({
        code: BILLING_ERROR_CODE.BILLING_PLAN_CATALOG_EMPTY,
        detail: 'No plans are loaded.',
      });
    }
    const plan = plans.find(p => p.id === planId);
    if (!plan) {
      throw new ServiceUnavailableException({
        code: BILLING_ERROR_CODE.BILLING_PLAN_NOT_FOUND,
        detail: `Plan "${planId}" is not present in loaded plans.`,
      });
    }
    return plan;
  }

  /**
   * Returns whether the state is a hard lock.
   * Hard locks block paid/usage actions immediately.
   */
  isHardLocked(state: BillingAccessState): boolean {
    return (
      state === BILLING_ACCESS_STATE.LockedDueToPayment ||
      state === BILLING_ACCESS_STATE.LockedWalletDepleted
    );
  }

  /**
   * Returns cached billing state for a user.
   * Throws if state is missing or contains invalid values.
   */
  async getStateForUser(userId: string): Promise<{
    planCode: BillingPlanCode;
    accessState: BillingAccessState;
  }> {
    let row = await this.prisma.client.billingEngineState.findUnique({
      where: { userId },
      select: { planCode: true, accessState: true },
    });
    if (!row) {
      const defaultPlanCode = getDefaultBillingPlanCode();
      try {
        await this.prisma.client.billingEngineState.create({
          data: {
            userId,
            provider: 'stripe',
            externalCustomerId: userId,
            engineSubscriptionExternalId: `sub_${userId}`,
            planCode: defaultPlanCode,
            accessState: BILLING_ACCESS_STATE.Enabled,
          },
          select: { userId: true },
        });
      } catch (err) {
        if (!isPrismaUniqueViolation(err)) throw err;
      }

      row = await this.prisma.client.billingEngineState.findUnique({
        where: { userId },
        select: { planCode: true, accessState: true },
      });
      if (!row) {
        throw new ServiceUnavailableException({
          code: BILLING_ERROR_CODE.BILLING_STATE_MISSING,
          detail: `Billing state is missing for user=${userId}.`,
        });
      }
    }

    const rawPlan = row.planCode.toString();
    if (!isBillingPlanCode(rawPlan)) {
      throw new ServiceUnavailableException({
        code: BILLING_ERROR_CODE.BILLING_STATE_INVALID_PLAN_CODE,
        detail: `Unknown billing plan code in state: ${rawPlan}`,
      });
    }
    const planCode: BillingPlanCode = rawPlan;
    if (!Object.values(BILLING_ACCESS_STATE).includes(row.accessState as BillingAccessState)) {
      throw new ServiceUnavailableException({
        code: BILLING_ERROR_CODE.BILLING_STATE_INVALID_ACCESS_STATE,
        detail: `Invalid billing access state in state: ${String(row.accessState)}.`,
      });
    }
    const accessState = row.accessState as BillingAccessState;
    return { planCode, accessState };
  }

  /**
   * Enforces that user is not hard-locked.
   * Throws `ForbiddenException` with user-facing reason when locked.
   */
  async assertNotHardLocked(userId: string): Promise<void> {
    const { accessState } = await this.getStateForUser(userId);
    if (!this.isHardLocked(accessState)) return;

    const code =
      accessState === BILLING_ACCESS_STATE.LockedWalletDepleted
        ? 'WALLET_DEPLETED'
        : 'PAYMENT_REQUIRED';

    throw new ForbiddenException({
      code,
      detail:
        accessState === BILLING_ACCESS_STATE.LockedWalletDepleted
          ? 'Wallet depleted; add credits to continue.'
          : 'Payment required; update your payment method to continue.',
    });
  }

  /**
   * Resolve numeric limit for a key (e.g. `projects_active`, `environments_running`).
   * Throws if key is missing or non-numeric in plan config.
   */
  async getLimit(userId: string, limitKey: string, _fallback: number): Promise<number> {
    const { planCode } = await this.getStateForUser(userId);
    const planId = planIdFromBillingPlanCode(planCode);
    const plan = this.resolvePlanById(planId);
    return this.getLimitFromPlan(plan, limitKey);
  }
}
