import type { BillingInterval, Plan,PublicPlan } from "@pytholit/contracts";

import { API_V1, apiRequest, snakeToCamel } from "./client";

export interface SubscriptionResponse {
  id: string;
  userId: string;
  planId: string | null;
  status: string;
  stripeSubscriptionId: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
  plan?: Plan | null;
}

export interface InvoiceResponse {
  id: string;
  stripeInvoiceId: string;
  amount: number;
  currency: string;
  status: string;
  paidAt?: string | null;
  dueDate?: string | null;
  invoiceUrl?: string | null;
  createdAt: string;
}

export interface PaymentMethodResponse {
  id: string;
  stripePaymentMethodId: string;
  type: string;
  last4: string;
  brand: string | null;
  expiryMonth: number | null;
  expiryYear: number | null;
  isDefault: boolean;
}

export async function createCheckoutSession(
  token: string | undefined,
  planId: string,
  interval: BillingInterval = "month"
): Promise<{ url: string }> {
  return apiRequest<{ url: string }>(`${API_V1}/billing/checkout`, {
    method: "POST",
    token,
    body: JSON.stringify({ planId, interval }),
  });
}

export async function createPortalSession(
  token: string | undefined
): Promise<{ url: string }> {
  return apiRequest<{ url: string }>(`${API_V1}/billing/portal`, {
    method: "POST",
    token,
  });
}

export async function getSubscription(
  token: string | undefined
): Promise<SubscriptionResponse | null> {
  const sub = await apiRequest<SubscriptionResponse | null>(
    `${API_V1}/billing/subscription`,
    { method: "GET", token }
  );
  return sub ? snakeToCamel(sub) : null;
}

export async function getInvoices(
  token: string | undefined
): Promise<InvoiceResponse[]> {
  const invoices = await apiRequest<InvoiceResponse[]>(`${API_V1}/billing/invoices`, {
    method: "GET",
    token,
  });
  return snakeToCamel(invoices);
}

export async function getPlans(): Promise<PublicPlan[]> {
  const plans = await apiRequest<PublicPlan[]>(`${API_V1}/billing/plans`, {
    method: "GET",
  });
  return snakeToCamel(plans);
}

export async function getPaymentMethods(
  token: string | undefined
): Promise<PaymentMethodResponse[]> {
  const methods = await apiRequest<PaymentMethodResponse[]>(
    `${API_V1}/billing/payment-methods`,
    {
      method: "GET",
      token,
    }
  );
  return snakeToCamel(methods);
}
