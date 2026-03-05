import { ServiceUnavailableException } from '@nestjs/common';
import { getDefaultPlan, getPlanByCode, getPlanCode } from '@pytholit/config';
import { type BillingInterval, type PlanId } from '@pytholit/contracts';

import { type BillingPlanCode } from './billing.interface';
import { BILLING_ERROR_CODE } from './billing-error-codes';

export function getDefaultBillingPlanCode(): BillingPlanCode {
  return getDefaultPlan().billing.monthly.code as BillingPlanCode;
}

export function isBillingPlanCode(value: unknown): value is BillingPlanCode {
  if (typeof value !== 'string') return false;
  return getPlanByCode(value) !== null;
}

export function billingPlanCodeFromMetadataValue(value: unknown): BillingPlanCode | null {
  if (!isBillingPlanCode(value)) return null;
  return value;
}

export function buildBillingPlanCode(planId: PlanId, interval: BillingInterval): BillingPlanCode {
  const planCode = getPlanCode(planId, interval);
  if (!planCode || !isBillingPlanCode(planCode)) {
    throw new ServiceUnavailableException({
      code: BILLING_ERROR_CODE.BILLING_PLAN_MAPPING_INVALID,
      detail: `Invalid billing plan mapping for planId=${String(planId)} interval=${String(interval)}.`,
    });
  }
  return planCode as BillingPlanCode;
}

export function parseBillingPlanCode(planCode: string): {
  planId: PlanId;
  billingInterval: BillingInterval;
} | null {
  const matched = getPlanByCode(planCode);
  if (!matched) return null;
  return { planId: matched.planId, billingInterval: matched.interval };
}

export function planIdFromBillingPlanCode(planCode: string): PlanId {
  const parsed = parseBillingPlanCode(planCode);
  if (!parsed) {
    throw new ServiceUnavailableException({
      code: BILLING_ERROR_CODE.BILLING_PLAN_CODE_INVALID,
      detail: `Invalid billing plan code: ${planCode}.`,
    });
  }
  return parsed.planId;
}
