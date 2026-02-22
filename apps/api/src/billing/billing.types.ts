import type { PublicPlan } from '@pytholit/contracts';

export type PaymentMethodResponse = {
  id: string;
  stripePaymentMethodId: string;
  type: string;
  last4: string;
  brand: string | null;
  expiryMonth: number | null;
  expiryYear: number | null;
  isDefault: boolean;
};

export type BillingSubscription = {
  id: string;
  planId: string;
  billingInterval: 'month' | 'year';
  status: string;
  featureAccessState: 'enabled' | 'locked_due_to_payment';
  walletCreditsUsable: boolean;
  periodStart: Date;
  periodEnd: Date;
  cancelAtPeriodEnd: boolean;
};

export type SubscriptionWithPlan = BillingSubscription & {
  plan: PublicPlan | null;
};

export type ValidatePaymentMethodResult = {
  valid: boolean;
  error?: string;
};

export type BillingInvoice = {
  id: string;
  number: string;
  amountCents: number;
  currency: 'USD';
  status: string;
  issuingDate?: Date;
  paymentDueDate?: Date;
  pdfUrl?: string;
};

export type InvoiceListResult = {
  items: BillingInvoice[];
  hasMore: boolean;
};
