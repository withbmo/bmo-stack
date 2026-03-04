import type Stripe from 'stripe';

import { billingPlanCodeFromMetadataValue } from '../billing-plan-code';
import type { BillingPlanCode } from '../billing.interface';

/** Extracts validated billing plan code from Stripe subscription metadata. */
export function extractBillingPlanCodeFromSubscription(
  subscription: Stripe.Subscription
): BillingPlanCode | null {
  const meta = (subscription.metadata ?? {}) as Record<string, unknown>;
  return billingPlanCodeFromMetadataValue(meta.planCode);
}

/** Extracts `planCatalogVersion` from Stripe subscription metadata. */
export function extractPlanCatalogVersionFromSubscription(
  subscription: Stripe.Subscription
): number | null {
  const meta = (subscription.metadata ?? {}) as Record<string, unknown>;
  const raw =
    typeof meta.planCatalogVersion === 'string'
      ? meta.planCatalogVersion
      : typeof meta.plan_catalog_version === 'string'
        ? meta.plan_catalog_version
        : '';
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) return null;
  return value;
}
