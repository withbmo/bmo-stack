import type {
  BillingInterval,
  CreditBalanceResponse,
  InvoiceListResponse,
  PlanChangeApplyInput,
  PlanChangeApplyResponse,
  PlanChangePreviewInput,
  PlanChangePreviewResponse,
  PublicPlan,
  Subscription,
} from "@pytholit/contracts";

import { API_V1, apiRequest, snakeToCamel } from "./client";

export interface SubscriptionResponse {
  rolloutEnabled: boolean;
  subscription: Subscription | null;
}

export interface InvoiceResponse {
  id: string;
  number: string;
  amountCents: number;
  currency: "USD";
  status: string;
  issuingDate?: string;
  paymentDueDate?: string;
  pdfUrl?: string;
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

export interface CheckoutResponse {
  status?: "activated" | "already_active" | "requires_payment_method" | "failed";
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

export async function createCheckoutSession(
  token: string | undefined,
  planId: string,
  interval: BillingInterval = "month"
): Promise<CheckoutResponse> {
  return apiRequest<CheckoutResponse>(`${API_V1}/billing/checkout`, {
    method: "POST",
    token,
    body: JSON.stringify({ planId, interval }),
  });
}

export async function finalizeCheckoutSession(
  token: string | undefined,
  pendingPlanCode: string
): Promise<CheckoutResponse> {
  return apiRequest<CheckoutResponse>(`${API_V1}/billing/checkout/finalize`, {
    method: "POST",
    token,
    body: JSON.stringify({ pendingPlanCode }),
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
): Promise<SubscriptionResponse> {
  const sub = await apiRequest<SubscriptionResponse>(
    `${API_V1}/billing/subscription`,
    { method: "GET", token }
  );
  return snakeToCamel(sub);
}

export async function getInvoices(
  token: string | undefined
): Promise<InvoiceListResponse> {
  const invoices = await apiRequest<InvoiceListResponse>(`${API_V1}/billing/invoices`, {
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

export async function previewPlanChange(
  token: string | undefined,
  input: PlanChangePreviewInput
): Promise<PlanChangePreviewResponse> {
  const response = await apiRequest<PlanChangePreviewResponse>(`${API_V1}/billing/plan/change/preview`, {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
  return snakeToCamel(response);
}

export async function applyPlanChange(
  token: string | undefined,
  input: PlanChangeApplyInput
): Promise<PlanChangeApplyResponse> {
  const response = await apiRequest<PlanChangeApplyResponse>(`${API_V1}/billing/plan/change/apply`, {
    method: "POST",
    token,
    body: JSON.stringify(input),
  });
  return snakeToCamel(response);
}

export async function getCreditBalance(
  token: string | undefined
): Promise<CreditBalanceResponse> {
  const response = await apiRequest<CreditBalanceResponse>(`${API_V1}/billing/credits`, {
    method: "GET",
    token,
  });
  return snakeToCamel(response);
}
