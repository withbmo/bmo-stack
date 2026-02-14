import freePlan from './plans/free.json';
import proPlan from './plans/pro.json';
import enterprisePlan from './plans/enterprise.json';
import { PlanSchema, PlansSchema } from './plans.schema';

export type BillingInterval = 'month' | 'year';

export type PlanFeatureValue = string | number | boolean | 'unlimited';

export type PlanFeature = {
  id: string;
  name: string;
  description: string | null;
  value: PlanFeatureValue;
};

export type Plan = {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  monthlyPrice: number;
  yearlyPrice: number;
  stripePriceIdMonthly: string | null;
  stripePriceIdYearly: string | null;
  features: PlanFeature[];
  isActive: boolean;
  isDefault: boolean;
};

export const PLANS = PlansSchema.parse([
  PlanSchema.parse(freePlan),
  PlanSchema.parse(proPlan),
  PlanSchema.parse(enterprisePlan),
]) as Plan[];

export const DEFAULT_PLAN_ID = 'free' as const;

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
  let defaultCount = 0;
  let featureIdSet: Set<string> | null = null;
  plans.forEach((plan, index) => {
    if (ids.has(plan.id)) {
      errors.push(`plans[${index}].id must be unique: ${plan.id}`);
    }
    ids.add(plan.id);
    if (plan.isDefault === true) {
      defaultCount += 1;
    }
    const currentFeatureIds = new Set(plan.features.map((f) => f.id));
    if (!featureIdSet) {
      featureIdSet = currentFeatureIds;
    } else {
      const missing = [...featureIdSet].filter((id) => !currentFeatureIds.has(id));
      const extra = [...currentFeatureIds].filter((id) => !featureIdSet.has(id));
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

  if (errors.length > 0) {
    throw new Error(`Invalid plan config:\\n${errors.join('\\n')}`);
  }
}

validatePlans(PLANS);

export function getPlans(): Plan[] {
  return PLANS.filter((plan) => plan.isActive);
}

export type PublicPlan = Omit<
  Plan,
  'stripePriceIdMonthly' | 'stripePriceIdYearly'
>;

export function getPublicPlans(): PublicPlan[] {
  return getPlans().map(({ stripePriceIdMonthly, stripePriceIdYearly, ...rest }) => ({
    ...rest,
  }));
}

export function getPlanById(planId: string): Plan | null {
  return PLANS.find((plan) => plan.id === planId) ?? null;
}

/**
 * Get credits for a given plan + billing interval.
 */
export function getPlanCredits(planId: string, interval: BillingInterval): number {
  const plan = getPlanById(planId);
  if (!plan) return 0;
  const priceUsd = interval === 'year' ? plan.yearlyPrice : plan.monthlyPrice;
  return getCreditsForUsd(priceUsd);
}

export function getDefaultPlan(): Plan {
  const explicitDefault =
    PLANS.find((plan) => plan.isDefault) ??
    getPlanById(DEFAULT_PLAN_ID) ??
    PLANS[0];
  return explicitDefault ?? (freePlan as Plan);
}

export function getStripePriceId(
  planId: string,
  interval: BillingInterval
): string | null {
  const plan = getPlanById(planId);
  if (!plan) return null;
  return interval === 'year' ? plan.stripePriceIdYearly : plan.stripePriceIdMonthly;
}

let priceIdToPlanCache: Map<string, Plan> | null = null;

export function getPlanByPriceId(priceId: string): Plan | null {
  if (!priceId) return null;
  if (!priceIdToPlanCache) {
    priceIdToPlanCache = new Map<string, Plan>();
    for (const plan of PLANS) {
      if (plan.stripePriceIdMonthly) {
        priceIdToPlanCache.set(plan.stripePriceIdMonthly, plan);
      }
      if (plan.stripePriceIdYearly) {
        priceIdToPlanCache.set(plan.stripePriceIdYearly, plan);
      }
    }
  }
  return priceIdToPlanCache.get(priceId) ?? null;
}
