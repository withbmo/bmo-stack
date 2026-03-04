import type {
  CheckoutSessionResponse,
  BillingInterval,
  InvoiceListResponse,
  PlanChangeApplyInput,
  PlanChangeApplyResponse,
  PlanChangePreviewInput,
  PlanChangePreviewResponse,
  PaidPlanId,
  Plan,
  Subscription,
} from "@pytholit/contracts";
import { BILLING_INTERVAL } from "@pytholit/contracts";

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

export async function createCheckoutSession(
  token: string | undefined,
  planId: PaidPlanId,
  interval: BillingInterval = BILLING_INTERVAL.MONTH
): Promise<CheckoutSessionResponse> {
  return apiRequest<CheckoutSessionResponse>(`${API_V1}/billing/checkout`, {
    method: "POST",
    token,
    body: JSON.stringify({ planId, interval }),
  });
}

export async function finalizeCheckoutSession(
  token: string | undefined,
  pendingPlanCode: PaidPlanId
): Promise<CheckoutSessionResponse> {
  return apiRequest<CheckoutSessionResponse>(`${API_V1}/billing/checkout/finalize`, {
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

let plansCache: Plan[] | null = null;
let plansCacheTime: number = 0;
const PLANS_CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export async function getPlans(): Promise<Plan[]> {
  const now = Date.now();

  // Return cached plans if still valid
  if (plansCache && now - plansCacheTime < PLANS_CACHE_DURATION) {
    return plansCache;
  }

  const plans = await apiRequest<Plan[]>(`${API_V1}/billing/plans`, {
    method: "GET",
  });
  const camelizedPlans = snakeToCamel(plans);

  // Update cache
  plansCache = camelizedPlans;
  plansCacheTime = now;

  return camelizedPlans;
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
