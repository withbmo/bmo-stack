/** All billable metric names. Extend this union as new usage types are added. */
export const BILLABLE_EVENTS = ['ec2_minutes', 'nat_gb', 'ai_tokens'] as const;
export type BillableEvent = (typeof BILLABLE_EVENTS)[number];

/** Billing engine plan code (source of truth lives in plan JSON variants). */
export type BillingPlanCode = string;

export const BILLING_ACCESS_STATE = {
  Enabled: 'enabled',
  LockedDueToPayment: 'locked_due_to_payment',
  LockedWalletDepleted: 'locked_wallet_depleted',
  LockedNoSubscription: 'locked_no_subscription',
} as const;
export type BillingAccessState = (typeof BILLING_ACCESS_STATE)[keyof typeof BILLING_ACCESS_STATE];

export interface UsageEvent {
  /** Maps to User.id — the universal external customer identifier. */
  externalCustomerId: string;
  /** Stripe customer id receiving usage events. */
  stripeCustomerId: string;
  eventName: BillableEvent;
  /** Usage amount sent to Stripe meter events (must be integer >= 0). */
  value: number;
  /** Idempotency key — prevents double-billing on retries. */
  idempotencyKey: string;
  timestamp?: Date;
}

export type BillingSnapshot = {
  planCode: BillingPlanCode;
  accessState: BillingAccessState;
  walletBalance: { amount: string; currency: 'USD' };
  limits: Record<string, number>;
};
