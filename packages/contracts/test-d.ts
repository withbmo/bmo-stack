import { expectType } from 'tsd';
import type { Plan, PlanFeatureValue } from './src/billing';

const featureValue: PlanFeatureValue = 'basic';
expectType<PlanFeatureValue>(featureValue);

declare const plan: Plan;
expectType<Plan>({
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
  features: plan.features,
  isActive: plan.isActive,
});
