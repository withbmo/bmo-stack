/**
 * Billing and subscription-related types
 */

export type BillingInterval = 'month' | 'year';
export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'past_due'
  | 'unpaid'
  | 'trialing';
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';
export type InvoiceStatus = 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';

export type PlanFeatureValue = number | boolean | string | 'unlimited';

export interface Plan {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  monthlyPrice: number;
  yearlyPrice: number;
  /**
   * Credits granted per successful payment for this interval.
   * Rule: credits = price_usd * 10
   */
  monthlyCredits: number;
  yearlyCredits: number;
  stripePriceIdMonthly: string | null;
  stripePriceIdYearly: string | null;
  features: PlanFeature[];
  isActive: boolean;
}

export interface PlanFeature {
  id: string;
  name: string;
  description: string | null;
  value: PlanFeatureValue;
}

export interface PublicPlan
  extends Omit<Plan, 'stripePriceIdMonthly' | 'stripePriceIdYearly'> {}

export interface Subscription {
  id: string;
  userId: string;
  planId: string | null;
  status: SubscriptionStatus;
  stripeSubscriptionId: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
  plan?: Plan | null;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  stripePaymentMethodId: string;
  type: string;
  last4: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export interface Invoice {
  id: string;
  userId: string;
  stripeInvoiceId: string;
  /**
   * Amount in minor units (e.g. cents).
   *
   * Example: $25.00 USD => 2500
   */
  amount: number;
  currency: string;
  status: InvoiceStatus;
  paidAt: string | null;
  dueDate: string | null;
  invoiceUrl: string | null;
  createdAt: string;
}

export interface CreateCheckoutSessionInput {
  planId: string;
  interval: BillingInterval;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}
