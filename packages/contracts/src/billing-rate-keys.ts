import { USAGE_CATEGORY, type UsageCategory } from './billing';

/**
 * Billable "rate keys" (SKUs) per usage category.
 *
 * This is intentionally code-owned (not DB-owned) in early-stage projects:
 * - Strong typing & validation
 * - Explicit review in PRs
 * - Predictable rollouts with deploys
 *
 * When you want dynamic pricing/keys without deploys, move this source of truth
 * to the RateCard tables and expose it via an API endpoint instead.
 */
export const BILLING_RATE_KEYS = {
  [USAGE_CATEGORY.AI]: ['gpt-5.2'] as const,
  [USAGE_CATEGORY.COMPUTE]: [] as const,
  [USAGE_CATEGORY.STORAGE]: [] as const,
  [USAGE_CATEGORY.EGRESS]: [] as const,
  [USAGE_CATEGORY.EXPORT]: [] as const,
} as const satisfies Record<UsageCategory, readonly string[]>;

type RateKeyByCategory = {
  [K in UsageCategory]: (typeof BILLING_RATE_KEYS)[K][number];
};

export type BillingRateKey = RateKeyByCategory[UsageCategory];

export const BILLING_RATE_KEYS_ALL: readonly string[] = Array.from(
  new Set(Object.values(BILLING_RATE_KEYS).flat())
);

export function isRateKeyForCategory(
  category: UsageCategory,
  rateKey: string
): rateKey is RateKeyByCategory[typeof category] {
  return (BILLING_RATE_KEYS[category] as readonly string[]).includes(rateKey);
}

