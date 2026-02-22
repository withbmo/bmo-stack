/**
 * Billing and subscription-related types
 */

export type BillingInterval = 'month' | 'year';
export type BillingCurrency = 'USD';
export type SubscriptionStatus =
  | 'active'
  | 'canceled'
  | 'past_due'
  | 'unpaid'
  | 'trialing';
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';
export type InvoiceStatus = 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';

export type PlanFeatureValue = number | boolean | string | 'unlimited';

export interface BillingPlan {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  currency: BillingCurrency;
  monthlyPriceCents: number;
  yearlyPriceCents: number;
  monthlyIncludedCredits: number;
  yearlyIncludedCredits: number;
  yearlyBonusCredits: number;
  yearlyDiscountPercent: number;
  features: PlanFeature[];
  isActive: boolean;
}

export interface PlanFeature {
  id: string;
  name: string;
  description: string | null;
  value: PlanFeatureValue;
}

export type PublicPlan = BillingPlan;

export type Plan = BillingPlan;

export type FeatureAccessState = 'enabled' | 'locked_due_to_payment';

export interface Subscription {
  id: string;
  planId: string;
  billingInterval: BillingInterval;
  status: SubscriptionStatus;
  featureAccessState: FeatureAccessState;
  walletCreditsUsable: boolean;
  periodStart: string;
  periodEnd: string;
  cancelAtPeriodEnd: boolean;
  plan?: PublicPlan | null;
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
  number: string;
  amountCents: number;
  currency: BillingCurrency;
  status: InvoiceStatus;
  issuingDate?: string;
  paymentDueDate?: string;
  pdfUrl?: string;
}

export interface CreateCheckoutSessionInput {
  planId: string;
  interval: BillingInterval;
}

export interface CheckoutSessionResponse {
  status?: 'activated' | 'already_active' | 'requires_payment_method' | 'failed';
  requiresPaymentMethod: boolean;
  paymentSetupUrl?: string;
  pendingPlanCode?: string;
  subscription?: {
    id: string;
    planCode: string;
    status: string;
  };
  url?: string;
}

export interface FinalizeCheckoutInput {
  pendingPlanCode: string;
}

export interface PurchaseCreditsResponse {
  credits: number;
  currency: BillingCurrency;
  checkoutUrl: string;
  purchaseId: string;
  idempotencyKey: string;
}

export interface InvoiceListResponse {
  items: Invoice[];
  hasMore: boolean;
}

export interface CreditBalanceResponse {
  walletBalance: number;
  currency: BillingCurrency;
  lastUpdatedAt: string;
}

export interface PlanChangePreviewInput {
  targetPlanId: string;
  targetInterval: BillingInterval;
}

export interface PlanChangePreviewResponse {
  previewId: string;
  prorationAmountCents: number;
  currency: BillingCurrency;
  creditDelta: number;
  includedCreditsDelta: number;
  effectiveAt: string;
  remainingRatio: number;
  oldPlan: {
    planId: string;
    interval: BillingInterval;
    priceCents: number;
    includedCredits: number;
  };
  newPlan: {
    planId: string;
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
