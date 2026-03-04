import { PlanSchema, PlansSchema } from './plans.schema';
import freePlan from './plans/free.json';
import maxPlan from './plans/max.json';
import proPlan from './plans/pro.json';

import { BILLING_INTERVAL, PLAN_ID, type BillingInterval, type PlanId } from '@pytholit/contracts';

export type PlanFeatureValue = string | number | boolean;

export type PlanFeature = {
  id: string;
  name: string;
  description: string | null;
  type: 'number' | 'boolean' | 'string';
  value: PlanFeatureValue;
};

export type PlanBillingVariant = {
  code: string;
  price: number;
  includedCredits: number;
  bonusCredits: number;
};

export type Plan = {
  version: number;
  id: PlanId;
  name: string;
  displayName: string;
  description: string | null;
  currency: 'USD';
  billing: {
    monthly: PlanBillingVariant;
    yearly: PlanBillingVariant;
  };
  features: PlanFeature[];
  isActive: boolean;
  isDefault: boolean;
};

const RAW_PLANS = PlansSchema.parse([
  PlanSchema.parse(freePlan),
  PlanSchema.parse(proPlan),
  PlanSchema.parse(maxPlan),
]) as Array<{
  version: number;
  id: PlanId;
  name: string;
  displayName: string;
  description: string | null;
  currency: 'USD';
  billing: {
    monthly: PlanBillingVariant;
    yearly: PlanBillingVariant;
  };
  features: PlanFeature[];
  isActive: boolean;
  isDefault: boolean;
}>;

export const PLANS = RAW_PLANS.map((plan): Plan => ({ ...plan }));

export const DEFAULT_PLAN_ID: PlanId = PLAN_ID.FREE;
export const PLAN_CATALOG_VERSION = PLANS[0]?.version ?? 1;

/**
 * Credits awarded per USD paid.
 * Example: $20 => 200 credits.
 */
export const CREDITS_PER_USD = 10 as const;

/**
 * Convert a USD price (e.g. 20) into credits (e.g. 200).
 * Rounds to the nearest integer to stay safe with non-integer USD prices.
 */
export function getCreditsForUsd(priceUsd: number): number {
  if (!Number.isFinite(priceUsd)) return 0;
  return Math.round(priceUsd * CREDITS_PER_USD);
}

export function validatePlans(plans: Plan[]): void {
  const errors: string[] = [];
  const ids = new Set<string>();
  const versions = new Set<number>();
  let defaultCount = 0;
  let featureIdSet: Set<string> | null = null;
  plans.forEach((plan, index) => {
    if (ids.has(plan.id)) {
      errors.push(`plans[${index}].id must be unique: ${plan.id}`);
    }
    ids.add(plan.id);
    versions.add(plan.version);
    if (plan.isDefault === true) {
      defaultCount += 1;
    }
    const currentFeatureIds = new Set(plan.features.map((f) => f.id));
    if (!featureIdSet) {
      featureIdSet = currentFeatureIds;
    } else {
      const baselineFeatureIds = featureIdSet;
      const missing = [...baselineFeatureIds].filter((id) => !currentFeatureIds.has(id));
      const extra = [...currentFeatureIds].filter((id) => !baselineFeatureIds.has(id));
      if (missing.length > 0 || extra.length > 0) {
        errors.push(
          `plans[${index}].features must match feature IDs across plans (missing: ${missing.join(
            ', '
          )}; extra: ${extra.join(', ')})`
        );
      }
    }
  });

  if (defaultCount === 0) {
    errors.push('At least one plan must have isDefault=true');
  }
  if (defaultCount > 1) {
    errors.push('Only one plan can have isDefault=true');
  }
  if (versions.size > 1) {
    errors.push(
      `All plans must share one catalog version (found: ${Array.from(versions).sort((a, b) => a - b).join(', ')})`
    );
  }

  if (errors.length > 0) {
    throw new Error(`Invalid plan config:\\n${errors.join('\\n')}`);
  }
}

validatePlans(PLANS);

export function getPlans(): Plan[] {
  return PLANS.filter((plan) => plan.isActive);
}

export function getPlanById(planId: string): Plan | null {
  return PLANS.find((plan) => plan.id === planId) ?? null;
}

export function getPlanVariant(
  planId: PlanId | string,
  interval: BillingInterval
): PlanBillingVariant | null {
  const plan = getPlanById(planId);
  if (!plan) return null;
  return interval === BILLING_INTERVAL.YEAR ? plan.billing.yearly : plan.billing.monthly;
}

export function getPlanByCode(planCode: string): {
  plan: Plan;
  planId: PlanId;
  interval: BillingInterval;
  variant: PlanBillingVariant;
} | null {
  for (const plan of PLANS) {
    if (plan.billing.monthly.code === planCode) {
      return {
        plan,
        planId: plan.id,
        interval: BILLING_INTERVAL.MONTH,
        variant: plan.billing.monthly,
      };
    }
    if (plan.billing.yearly.code === planCode) {
      return {
        plan,
        planId: plan.id,
        interval: BILLING_INTERVAL.YEAR,
        variant: plan.billing.yearly,
      };
    }
  }
  return null;
}

export function getPlanCode(planId: PlanId | string, interval: BillingInterval): string | null {
  const variant = getPlanVariant(planId, interval);
  return variant?.code ?? null;
}

/**
 * Get credits for a given plan + billing interval.
 */
export function getPlanCredits(planId: PlanId | string, interval: BillingInterval): number {
  const variant = getPlanVariant(planId, interval);
  if (!variant) return 0;
  return variant.includedCredits + variant.bonusCredits;
}

export function getDefaultPlan(): Plan {
  const explicitDefault = PLANS.find((plan) => plan.isDefault);
  if (!explicitDefault) {
    throw new Error('Invalid plan config: no default plan (isDefault=true) found.');
  }
  return explicitDefault;
}

export function getPlanCatalogVersion(): number {
  return PLAN_CATALOG_VERSION;
}
