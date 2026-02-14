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
  monthlyPrice: plan.monthlyPrice,
  yearlyPrice: plan.yearlyPrice,
  monthlyCredits: plan.monthlyCredits,
  yearlyCredits: plan.yearlyCredits,
  features: plan.features,
  isActive: plan.isActive,
});
