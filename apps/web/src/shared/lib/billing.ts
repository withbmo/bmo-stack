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
import { getPlans as getStaticPlans } from "@pytholit/config";

import { API_V1, apiRequest, snakeToCamel } from "./client";

export interface SubscriptionResponse {
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

const SUBSCRIPTION_CACHE_TTL_MS = 3000;
let subscriptionCache:
  | { key: string; expiresAt: number; value: SubscriptionResponse }
  | null = null;
const subscriptionInFlight = new Map<string, Promise<SubscriptionResponse>>();

const INVOICES_CACHE_TTL_MS = 15000;
let invoicesCache:
  | { key: string; expiresAt: number; value: InvoiceListResponse }
  | null = null;
const invoicesInFlight = new Map<string, Promise<InvoiceListResponse>>();

function isRateLimitError(err: unknown): boolean {
  const status = (err as { status?: unknown })?.status;
  return status === 429;
}

export function invalidateSubscriptionCache(): void {
  subscriptionCache = null;
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

export async function cancelSubscription(
  token: string | undefined
): Promise<{ cancelAtPeriodEnd: true }> {
  return apiRequest<{ cancelAtPeriodEnd: true }>(`${API_V1}/billing/subscription/cancel`, {
    method: "POST",
    token,
  });
}

export async function reactivateSubscription(
  token: string | undefined
): Promise<{ cancelAtPeriodEnd: false }> {
  return apiRequest<{ cancelAtPeriodEnd: false }>(`${API_V1}/billing/subscription/reactivate`, {
    method: "POST",
    token,
  });
}

export async function cancelScheduledDowngrade(
  token: string | undefined
): Promise<{ cleared: true }> {
  return apiRequest<{ cleared: true }>(`${API_V1}/billing/subscription/downgrade/cancel`, {
    method: "POST",
    token,
  });
}

export async function createTopupSession(
  token: string | undefined,
  amountUsd: 10 | 25 | 50 | 100
): Promise<{ url: string }> {
  return apiRequest<{ url: string }>(`${API_V1}/billing/topup`, {
    method: "POST",
    token,
    body: JSON.stringify({ amountUsd }),
  });
}

export async function getSubscription(
  token: string | undefined
): Promise<SubscriptionResponse> {
  const key = token ?? "__session__";
  const now = Date.now();
  if (
    subscriptionCache &&
    subscriptionCache.key === key &&
    subscriptionCache.expiresAt > now
  ) {
    return subscriptionCache.value;
  }

  const existing = subscriptionInFlight.get(key);
  if (existing) return existing;

  const request = (async () => {
    try {
      const sub = await apiRequest<SubscriptionResponse>(
        `${API_V1}/billing/subscription`,
        { method: "GET", token }
      );
      const normalized = snakeToCamel(sub);
      subscriptionCache = {
        key,
        value: normalized,
        expiresAt: Date.now() + SUBSCRIPTION_CACHE_TTL_MS,
      };
      return normalized;
    } catch (err) {
      if (
        isRateLimitError(err) &&
        subscriptionCache &&
        subscriptionCache.key === key
      ) {
        return subscriptionCache.value;
      }
      throw err;
    }
  })();

  subscriptionInFlight.set(key, request);
  try {
    return await request;
  } finally {
    subscriptionInFlight.delete(key);
  }
}

export async function getInvoices(
  token: string | undefined
): Promise<InvoiceListResponse> {
  const key = token ?? "__session__";
  const now = Date.now();
  if (invoicesCache && invoicesCache.key === key && invoicesCache.expiresAt > now) {
    return invoicesCache.value;
  }

  const existing = invoicesInFlight.get(key);
  if (existing) return existing;

  const request = (async () => {
    try {
      const invoices = await apiRequest<InvoiceListResponse>(`${API_V1}/billing/invoices`, {
        method: "GET",
        token,
      });
      const normalized = snakeToCamel(invoices);
      invoicesCache = {
        key,
        value: normalized,
        expiresAt: Date.now() + INVOICES_CACHE_TTL_MS,
      };
      return normalized;
    } catch (err) {
      if (isRateLimitError(err) && invoicesCache && invoicesCache.key === key) {
        return invoicesCache.value;
      }
      throw err;
    }
  })();

  invoicesInFlight.set(key, request);
  try {
    return await request;
  } finally {
    invoicesInFlight.delete(key);
  }
}

/**
 * Get plans from static configuration
 * Plans are embedded in the app bundle and don't require API calls
 * Updates only happen when the app is redeployed with new plan configs
 */
export async function getPlans(): Promise<Plan[]> {
  const staticPlans = getStaticPlans();

  // Transform config plans to API plan format
  return staticPlans.map((plan) => ({
    id: plan.id,
    name: plan.name,
    displayName: plan.displayName,
    description: plan.description,
    currency: plan.currency,
    monthlyPriceCents: plan.billing.monthly.price * 100,
    yearlyPriceCents: plan.billing.yearly.price * 100,
    monthlyIncludedCredits: plan.billing.monthly.includedCredits,
    yearlyIncludedCredits: plan.billing.yearly.includedCredits,
    yearlyBonusCredits: plan.billing.yearly.bonusCredits,
    features: plan.features,
    isActive: plan.isActive,
    isDefault: plan.isDefault,
  }));
}

export interface PaymentMethodResponse {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

export interface UsageEventSettings {
  eventName: "ai_tokens" | "ec2_minutes" | "nat_gb";
  label: string;
  consumedCredits: number;
  maxCredits: number | null;
  unlimited: boolean;
}

export interface UsageSettingsResponse {
  currentCredits: number;
  currency: "USD";
  periodStart: string;
  events: UsageEventSettings[];
}

const PM_CACHE_TTL_MS = 30000;
let pmCache: { key: string; expiresAt: number; value: PaymentMethodResponse | null } | null = null;

export function invalidatePaymentMethodCache(): void {
  pmCache = null;
}

export async function getPaymentMethod(
  token: string | undefined
): Promise<PaymentMethodResponse | null> {
  const key = token ?? "__session__";
  const now = Date.now();
  if (pmCache && pmCache.key === key && pmCache.expiresAt > now) {
    return pmCache.value;
  }
  try {
    const pm = await apiRequest<PaymentMethodResponse | null>(`${API_V1}/billing/payment-method`, {
      method: "GET",
      token,
    });
    pmCache = { key, value: pm, expiresAt: Date.now() + PM_CACHE_TTL_MS };
    return pm;
  } catch {
    return null;
  }
}

export async function getUsageSettings(
  token: string | undefined
): Promise<UsageSettingsResponse> {
  const response = await apiRequest<UsageSettingsResponse>(`${API_V1}/billing/usage/settings`, {
    method: "GET",
    token,
  });
  return snakeToCamel(response);
}

export async function updateUsageSettings(
  token: string | undefined,
  input: {
    events: Array<{
      eventName: "ai_tokens" | "ec2_minutes" | "nat_gb";
      unlimited: boolean;
      maxCredits?: number;
    }>;
  }
): Promise<UsageSettingsResponse> {
  const response = await apiRequest<UsageSettingsResponse>(`${API_V1}/billing/usage/settings`, {
    method: "PUT",
    token,
    body: JSON.stringify(input),
  });
  return snakeToCamel(response);
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
