import type { PlanFeatureValue } from './billing';

export interface EntitlementFeatureUsage {
  id: string;
  name: string;
  value: PlanFeatureValue;
  used: number;
  remaining: number | 'unlimited';
}

export interface EntitlementLimitsResponse {
  planId: string;
  periodStart: string;
  periodEnd: string;
  features: EntitlementFeatureUsage[];
}

export interface RecordEntitlementUsageInput {
  featureId: string;
  amount: number;
}
