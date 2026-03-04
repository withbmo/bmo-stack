/**
 * Billing and subscription-related types
 */

export const BILLING_INTERVAL = {
  MONTH: 'month',
  YEAR: 'year',
} as const;
export type BillingInterval = (typeof BILLING_INTERVAL)[keyof typeof BILLING_INTERVAL];

export const BILLING_INTERVALS = [BILLING_INTERVAL.MONTH, BILLING_INTERVAL.YEAR] as const;

export const PLAN_ID = {
  FREE: 'free',
  PRO: 'pro',
  MAX: 'max',
} as const;
export type PlanId = (typeof PLAN_ID)[keyof typeof PLAN_ID];

export const PLAN_IDS = [PLAN_ID.FREE, PLAN_ID.PRO, PLAN_ID.MAX] as const;

export const PAID_PLAN_IDS = [PLAN_ID.PRO, PLAN_ID.MAX] as const;
export type PaidPlanId = (typeof PAID_PLAN_IDS)[number];

export function isPlanId(value: unknown): value is PlanId {
  return typeof value === 'string' && (PLAN_IDS as readonly string[]).includes(value);
}

export function isPaidPlanId(value: unknown): value is PaidPlanId {
  return typeof value === 'string' && (PAID_PLAN_IDS as readonly string[]).includes(value);
}

export const BILLING_CURRENCY = {
  USD: 'USD',
} as const;
export type BillingCurrency = (typeof BILLING_CURRENCY)[keyof typeof BILLING_CURRENCY];

/**
 * Subscription status values from Stripe.
 * Represents the lifecycle state of a subscription.
 */
export const SUBSCRIPTION_STATUS = {
  /** Subscription is active and payments are up to date. */
  ACTIVE: 'active',
  /** Subscription is in trial period. */
  TRIALING: 'trialing',
  /** Initial payment pending (e.g., 3D Secure requires action). */
  INCOMPLETE: 'incomplete',
  /** Initial payment failed after 24h timeout. */
  INCOMPLETE_EXPIRED: 'incomplete_expired',
  /** Latest payment failed, Stripe is retrying. */
  PAST_DUE: 'past_due',
  /** Payment failed after all retries exhausted. */
  UNPAID: 'unpaid',
  /** Subscription is temporarily paused. */
  PAUSED: 'paused',
  /** Subscription has been canceled and will not renew. */
  CANCELED: 'canceled',
  /** Plan upgrade is being processed. */
  PROCESSING_UPGRADE: 'processing_upgrade',
} as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS];

/**
 * Determines whether a user can access premium features.
 * This is derived from subscription status and payment state.
 */
export const FEATURE_ACCESS_STATE = {
  /** User can access all features from their subscribed plan. */
  ENABLED: 'enabled',
  /** Payment failed - user is treated as free tier until resolved. */
  LOCKED_DUE_TO_PAYMENT: 'locked_due_to_payment',
  /** No active subscription - user is on free tier. */
  LOCKED_NO_SUBSCRIPTION: 'locked_no_subscription',
} as const;
export type FeatureAccessState =
  (typeof FEATURE_ACCESS_STATE)[keyof typeof FEATURE_ACCESS_STATE];

export const LEDGER_ENTRY_TYPE = {
  GRANT: 'grant',
  DEBIT: 'debit',
  REVERSAL: 'reversal',
  ADJUSTMENT: 'adjustment',
} as const;
export type LedgerEntryType = (typeof LEDGER_ENTRY_TYPE)[keyof typeof LEDGER_ENTRY_TYPE];

export const USAGE_EVENT_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED_INSUFFICIENT_CREDITS: 'rejected_insufficient_credits',
  REJECTED_NOT_ALLOWED: 'rejected_not_allowed',
  DUPLICATE: 'duplicate',
  REVERSED: 'reversed',
} as const;
export type UsageEventStatus = (typeof USAGE_EVENT_STATUS)[keyof typeof USAGE_EVENT_STATUS];

export const STRIPE_WEBHOOK_PROCESSING_STATUS = {
  RECEIVED: 'received',
  QUEUED: 'queued',
  PROCESSED: 'processed',
  FAILED: 'failed',
} as const;
export type StripeWebhookProcessingStatus =
  (typeof STRIPE_WEBHOOK_PROCESSING_STATUS)[keyof typeof STRIPE_WEBHOOK_PROCESSING_STATUS];

export const BILLING_SCOPE = {
  FEATURE: 'feature',
  QUOTA: 'quota',
  CREDITS: 'credits',
  BILLING: 'billing',
} as const;
export type BillingScope = (typeof BILLING_SCOPE)[keyof typeof BILLING_SCOPE];

export const BILLING_REASON_CODE = {
  OK: 'OK',

  BILLING_ROLLOUT_DISABLED: 'BILLING_ROLLOUT_DISABLED',

  FEATURE_NOT_IN_PLAN: 'FEATURE_NOT_IN_PLAN',
  PLAN_LIMIT_REACHED: 'PLAN_LIMIT_REACHED',
  SUBSCRIPTION_LOCKED: 'SUBSCRIPTION_LOCKED',
  INSUFFICIENT_CREDITS: 'INSUFFICIENT_CREDITS',

  INVALID_REQUEST: 'INVALID_REQUEST',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;
export type BillingReasonCode = (typeof BILLING_REASON_CODE)[keyof typeof BILLING_REASON_CODE];

export const USAGE_CATEGORY = {
  AI: 'ai',
  COMPUTE: 'compute',
  STORAGE: 'storage',
  EGRESS: 'egress',
  EXPORT: 'export',
} as const;
export type UsageCategory = (typeof USAGE_CATEGORY)[keyof typeof USAGE_CATEGORY];

export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';
export type InvoiceStatus = 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';

export type PlanFeatureValue = number | boolean | string;
export type PlanFeatureType = 'number' | 'boolean' | 'string';

export interface BillingPlan {
  id: PlanId;
  name: string;
  displayName: string;
  description: string | null;
  currency: BillingCurrency;
  monthlyPriceCents: number;
  yearlyPriceCents: number;
  monthlyIncludedCredits: number;
  yearlyIncludedCredits: number;
  yearlyBonusCredits: number;
  features: PlanFeature[];
  isActive: boolean;
  isDefault?: boolean;
}

export interface PlanFeature {
  id: string;
  name: string;
  description: string | null;
  type: PlanFeatureType;
  value: PlanFeatureValue;
}

export type Plan = BillingPlan;

export interface Subscription {
  id: string;
  planId: PlanId;
  billingInterval: BillingInterval;
  status: SubscriptionStatus;
  featureAccessState: FeatureAccessState;
  walletCreditsUsable: boolean;
  periodStart: string;
  periodEnd: string;
  cancelAtPeriodEnd: boolean;
  plan?: Plan | null;
}

export interface Invoice {
  id: string;
  number: string;
  amountCents: number;
  currency: BillingCurrency;
  status: InvoiceStatus;
  issuingDate?: string;
  paymentDueDate?: string;
  pdfUrl?: string;
}

export interface CreateCheckoutSessionInput {
  planId: PaidPlanId;
  interval: BillingInterval;
}

export interface CheckoutSessionResponse {
  status?: 'activated' | 'already_active' | 'requires_payment_method' | 'failed';
  requiresPaymentMethod: boolean;
  paymentSetupUrl?: string;
  pendingPlanCode?: PaidPlanId;
  subscription?: {
    id: string;
    planCode: string;
    status: string;
  };
  url?: string;
}

export interface FinalizeCheckoutInput {
  pendingPlanCode: PaidPlanId;
}

export interface InvoiceListResponse {
  items: Invoice[];
  hasMore: boolean;
  nextCursor?: string;
}

export interface WalletBalanceResponse {
  billingAccountId: string;
  /**
   * Credits remaining, represented as a decimal string.
   * (Credits may be fractional because usage is tracked in micro-USD.)
   */
  balanceCredits: string;
  /** Raw balance in micro-USD (same unit as Wallet.balanceMicrocredits). */
  balanceMicroUsd: string;
}

export interface BillingCheckInput {
  /**
   * Logical action key, e.g. "project.create", "environment.start", "usage.consume".
   * Used only for auditing/telemetry and optional server-side routing.
   */
  action: string;
  /** Optional feature/quota key to check (e.g. "projects_active"). */
  key?: string;
  /** Optional increment for quota checks (default 1). */
  amount?: number;
  /** Optional rating key + units for cost estimation. */
  rateKey?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  units?: Record<string, any>;
}

export interface BillingCheckResponse {
  allowed: boolean;
  reasonCode: BillingReasonCode;
  scope: BillingScope;
  currentPlanId: PlanId;
  billingStatus: SubscriptionStatus;
  current?: number;
  limit?: number;
  balanceCredits?: number;
  estimatedCostCredits?: number;
  nextResetAt?: string | null;
  recommendedAction?:
    | 'upgrade_plan'
    | 'buy_credits'
    | 'wait_for_webhook'
    | 'reduce_usage'
    | null;
}

export interface PlanChangePreviewInput {
  targetPlanId: PlanId;
  targetInterval: BillingInterval;
}

export interface PlanChangePreviewResponse {
  previewId: string;
  /**
   * True when proration is calculated locally and may differ from provider-finalized amounts.
   */
  isEstimated: boolean;
  prorationAmountCents: number;
  currency: BillingCurrency;
  creditDelta: number;
  includedCreditsDelta: number;
  effectiveAt: string;
  remainingRatio: number;
  oldPlan: {
    planId: PlanId;
    interval: BillingInterval;
    priceCents: number;
    includedCredits: number;
  };
  newPlan: {
    planId: PlanId;
    interval: BillingInterval;
    priceCents: number;
    includedCredits: number;
  };
}

export interface PlanChangeApplyInput extends PlanChangePreviewInput {
  previewId: string;
}

export interface PlanChangeApplyResponse {
  status: 'activated' | 'already_active' | 'requires_payment_method' | 'failed';
  subscriptionSnapshot: Subscription | null;
}
