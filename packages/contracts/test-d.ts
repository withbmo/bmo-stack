import { expectType } from 'tsd';
import type { Plan, PublicPlan, PlanFeatureValue } from './src/billing';

const featureValue: PlanFeatureValue = 'unlimited';
expectType<PlanFeatureValue>(featureValue);

declare const plan: Plan;
expectType<PublicPlan>({
  id: plan.id,
  name: plan.name,
  displayName: plan.displayName,
  description: plan.description,
  currency: plan.currency,
  monthlyPriceCents: plan.monthlyPriceCents,
  yearlyPriceCents: plan.yearlyPriceCents,
  monthlyIncludedCredits: plan.monthlyIncludedCredits,
  yearlyIncludedCredits: plan.yearlyIncludedCredits,
  yearlyBonusCredits: plan.yearlyBonusCredits,
  yearlyDiscountPercent: plan.yearlyDiscountPercent,
  features: plan.features,
  isActive: plan.isActive,
});
