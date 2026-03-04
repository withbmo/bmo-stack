import { BILLING_INTERVAL, isPaidPlanId, type BillingInterval, type Plan } from '@pytholit/contracts';
import {
  BarChart2,
  CircleDollarSign,
  CreditCard,
  Download,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { BillingSkeleton } from '@/dashboard/components';
import { useAuth } from '@/shared/auth';
import { DashboardPageHeader } from '@/shared/components/layout';
import { PLAN_FEATURES,USAGE_METRICS } from '@/shared/constants/settings';
import {
  createCheckoutSession,
  createPortalSession,
  finalizeCheckoutSession,
  getInvoices,
  getPlans,
  getSubscription,
  type InvoiceResponse,
  type SubscriptionResponse,
} from '@/shared/lib/billing';

const formatCurrency = (amount: number, currency: string) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);

const formatDate = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '—';

const formatPeriod = (start: string, end: string) =>
  `${new Date(start).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })} — ${new Date(end).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })}`;

export const BillingTab = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, hydrated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscriptionResponse, setSubscriptionResponse] = useState<SubscriptionResponse | null>(null);
  const [billingInterval, setBillingInterval] = useState<BillingInterval>(BILLING_INTERVAL.MONTH);
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [isFinalizingCheckout, setIsFinalizingCheckout] = useState(false);

  useEffect(() => {
    if (!hydrated || !user) return;
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const [sub, inv, planData] = await Promise.all([
          getSubscription(undefined),
          getInvoices(undefined),
          getPlans(),
        ]);
        if (cancelled) return;
        setSubscriptionResponse(sub);
        setInvoices(inv.items ?? []);
        setPlans(planData);
        if (planData.length > 0) {
          const subPlanId = sub?.subscription?.planId ?? null;
          const preferredPlanId =
            (subPlanId && planData.some((p) => p.id === subPlanId) ? subPlanId : planData[0]?.id) ||
            '';
          setSelectedPlanId((prev) =>
            prev && planData.some((p) => p.id === prev) ? prev : preferredPlanId
          );
        }
      } catch {
        if (!cancelled) toast.error('Failed to load billing data');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hydrated, user]);

  const activePlan = useMemo(() => {
    const subPlanId = subscriptionResponse?.subscription?.planId ?? null;
    if (subPlanId) {
      return plans.find((p) => p.id === subPlanId) || null;
    }
    return plans[0] || null;
  }, [plans, subscriptionResponse?.subscription?.planId]);

  const selectedPlan = useMemo(() => {
    if (!plans.length) return null;
    const found = plans.find((p) => p.id === selectedPlanId);
    return found ?? activePlan ?? plans[0] ?? null;
  }, [activePlan, plans, selectedPlanId]);

  const currentSubscription = subscriptionResponse?.subscription ?? null;
  const rolloutEnabled = subscriptionResponse?.rolloutEnabled ?? false;
  const isActive = currentSubscription?.status === 'active' || currentSubscription?.status === 'trialing';
  const isSelectedCurrentPlan = Boolean(
    isActive && selectedPlan?.id && selectedPlan.id === currentSubscription?.planId
  );
  const planLabel = activePlan?.name || (isActive ? 'Active' : 'Free');
  const planPrice = activePlan
    ? `$${((billingInterval === BILLING_INTERVAL.YEAR
      ? activePlan.yearlyPriceCents
      : activePlan.monthlyPriceCents) / 100).toFixed(0)} / ${
        billingInterval === BILLING_INTERVAL.YEAR ? 'year' : 'month'
      }`
    : isActive
      ? 'Active subscription'
      : 'No active subscription';
  const nextCharge = currentSubscription?.periodEnd || null;

  useEffect(() => {
    if (!hydrated || !user) return;

    const setup = searchParams.get('setup');
    const pendingPlanCode = searchParams.get('pendingPlanCode');
    if (setup !== 'success' || !pendingPlanCode || isFinalizingCheckout) return;
    if (!isPaidPlanId(pendingPlanCode)) {
      toast.error('Invalid pending plan code in URL.');
      router.replace('/dashboard/settings/billing');
      return;
    }

    let cancelled = false;
    (async () => {
      setIsFinalizingCheckout(true);
      try {
        await finalizeCheckoutSession(undefined, pendingPlanCode);
        if (cancelled) return;
        toast.success('Plan activated successfully.');
        router.replace('/dashboard/settings/billing');
      } catch (err: any) {
        if (cancelled) return;
        toast.error(err?.detail || 'Failed to finalize checkout');
      } finally {
        if (!cancelled) setIsFinalizingCheckout(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrated, isFinalizingCheckout, router, searchParams, user]);

  const billingHistory = useMemo(() => {
    if (invoices.length === 0) return [];
    return invoices.map(inv => ({
      invoice: inv.number,
      period: formatPeriod(inv.issuingDate || new Date().toISOString(), inv.issuingDate || new Date().toISOString()),
      amount: formatCurrency(inv.amountCents, inv.currency),
      status: inv.status,
      date: inv.issuingDate || '',
      invoiceUrl: inv.pdfUrl,
    }));
  }, [invoices]);

  const handleCheckout = async () => {
    if (!hydrated || !user) return;
    if (!rolloutEnabled) {
      toast.error('Billing checkout is not enabled for this account yet.');
      return;
    }
    if (!selectedPlan) {
      toast.error('Missing selected plan');
      return;
    }
    if (isSelectedCurrentPlan) {
      toast.error('Selected plan is already active');
      return;
    }
    if (!isPaidPlanId(selectedPlan.id)) {
      toast.error('Select a paid plan to start checkout.');
      return;
    }
    try {
      const result = await createCheckoutSession(undefined, selectedPlan.id, billingInterval);
      if (result.requiresPaymentMethod && result.paymentSetupUrl) {
        window.location.href = result.paymentSetupUrl;
        return;
      }
      if (result.url) {
        window.location.href = result.url;
        return;
      }
      toast.success('Checkout completed.');
      router.refresh();
    } catch (err: any) {
      toast.error(err?.detail || 'Failed to start checkout');
    }
  };

  const handlePortal = async () => {
    if (!hydrated || !user) return;
    if (!rolloutEnabled) {
      toast.error('Billing portal is not enabled for this account yet.');
      return;
    }
    try {
      const { url } = await createPortalSession(undefined);
      window.location.href = url;
    } catch (err: any) {
      toast.error(err?.detail || 'Failed to open billing portal');
    }
  };

  if (isLoading) {
    return <BillingSkeleton />;
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
      <DashboardPageHeader
        badge={{ icon: CreditCard, label: 'BILLING' }}
        title="BILLING OVERVIEW"
        subtitle="Update payment methods, inspect invoices, and control spend"
        variant="minimal"
        className="mb-0 border-0 pb-0"
      />

      {plans.length === 0 ? (
        <div className="border border-nexus-gray bg-nexus-dark p-6">
          <div className="font-mono text-xs text-nexus-muted uppercase tracking-widest mb-2">
            Billing
          </div>
          <div className="text-white font-sans text-xl font-bold mb-2">
            No plan is available right now
          </div>
          <p className="font-mono text-xs text-nexus-light/60">
            Your subscription is still active if you already have one. Please check back later.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="bg-nexus-dark border border-nexus-gray relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-nexus-purple to-nexus-accent" />
            <div className="p-6 flex flex-col gap-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="font-mono text-[10px] text-nexus-muted uppercase tracking-widest">
                    Current Plan
                  </span>
                  <div className="mt-2 flex items-end gap-3">
                    <span className="text-3xl font-sans font-bold text-white">{planLabel}</span>
                    <span className="font-mono text-xs text-nexus-muted uppercase">
                      {planPrice}
                    </span>
                  </div>
                </div>
                <button
                  onClick={isSelectedCurrentPlan ? handlePortal : handleCheckout}
                  className="px-4 py-2 border border-nexus-purple text-nexus-purple font-mono text-[10px] uppercase tracking-wider hover:bg-nexus-purple/10 transition-colors flex items-center gap-2 disabled:opacity-60"
                  disabled={isLoading || isFinalizingCheckout || !rolloutEnabled}
                >
                  <CircleDollarSign size={14} />
                  {isSelectedCurrentPlan ? 'Manage Plan' : 'Upgrade / Downgrade'}
                </button>
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                {plans.map((plan) => {
                  const isCurrent = Boolean(
                    currentSubscription?.planId && plan.id === currentSubscription.planId && isActive
                  );
                  const isSelected = selectedPlan?.id === plan.id;

                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`border px-3 py-3 text-left transition-colors ${
                        isSelected
                          ? 'border-nexus-purple bg-nexus-purple/10'
                          : 'border-nexus-gray hover:border-nexus-purple/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs uppercase text-white">{plan.displayName}</span>
                        {isCurrent ? (
                          <span className="font-mono text-[10px] uppercase text-nexus-accent">Current</span>
                        ) : null}
                      </div>
                        <div className="mt-1 font-mono text-[10px] text-nexus-muted">
                        ${((billingInterval === BILLING_INTERVAL.YEAR
                          ? plan.yearlyPriceCents
                          : plan.monthlyPriceCents) / 100).toFixed(0)}/
                        {billingInterval === BILLING_INTERVAL.YEAR ? 'year' : 'month'}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setBillingInterval(BILLING_INTERVAL.MONTH)}
                  className={`px-3 py-1 border font-mono text-[10px] uppercase tracking-wider transition-colors ${
                    billingInterval === BILLING_INTERVAL.MONTH
                      ? 'border-nexus-purple text-nexus-purple bg-nexus-purple/10'
                      : 'border-nexus-gray text-nexus-muted hover:text-nexus-purple hover:border-nexus-purple/60'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingInterval(BILLING_INTERVAL.YEAR)}
                  className={`px-3 py-1 border font-mono text-[10px] uppercase tracking-wider transition-colors ${
                    billingInterval === BILLING_INTERVAL.YEAR
                      ? 'border-nexus-purple text-nexus-purple bg-nexus-purple/10'
                      : 'border-nexus-gray text-nexus-muted hover:text-nexus-purple hover:border-nexus-purple/60'
                  }`}
                >
                  Yearly
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {(selectedPlan?.features?.length
                  ? selectedPlan.features.map(feature => feature.name)
                  : PLAN_FEATURES
                ).map(feature => (
                  <div key={feature} className="flex items-start gap-2 text-nexus-light/80">
                    <ShieldCheck size={14} className="mt-0.5 text-nexus-purple" />
                    <span className="font-mono text-[11px] uppercase leading-snug">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-nexus-dark border border-nexus-gray p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] text-nexus-muted uppercase tracking-widest">
                  Billing portal
                </span>
                <p className="font-mono text-xs text-nexus-light/60 mt-1">
                  Manage payment methods, invoices, and cancellations.
                </p>
              </div>
            </div>
            <div className="border border-nexus-gray/50 p-4 bg-nexus-black/50 flex flex-col gap-3">
              {!rolloutEnabled ? (
                <p className="font-mono text-[10px] text-yellow-400 uppercase tracking-wider">
                  Billing controls are unavailable for this account cohort.
                </p>
              ) : null}
              <div className="flex items-center gap-3 text-white">
                <Wallet size={16} className="text-nexus-purple" />
                <div>
                  <p className="font-mono text-sm">Manage billing and payment details</p>
                  <p className="font-mono text-[10px] text-nexus-muted uppercase">
                    Update in billing portal
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handlePortal}
                  className="flex-1 border border-nexus-gray/60 text-nexus-muted hover:text-white hover:border-white px-3 py-2 font-mono text-[10px] uppercase tracking-wider transition-colors"
                >
                  Manage payment
                </button>
              </div>
            </div>
            {currentSubscription?.status === 'active' ? (
              <div className="flex items-center justify-between text-nexus-light/60 font-mono text-xs uppercase">
                <span>Next charge</span>
                <span className="text-white">{formatDate(nextCharge)}</span>
              </div>
            ) : null}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-nexus-muted uppercase tracking-widest">
          <BarChart2 size={14} className="text-nexus-purple" />
          Usage snapshot
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {USAGE_METRICS.map(metric => (
            <div
              key={metric.id}
              className="border border-nexus-gray bg-nexus-dark p-5 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] text-nexus-muted uppercase tracking-wider">
                  {metric.label}
                </span>
                <span className="font-mono text-xs text-nexus-light/60">{metric.value}</span>
              </div>
              <div className="h-[6px] w-full bg-nexus-black/40">
                <div
                  className="h-full bg-gradient-to-r from-nexus-purple to-nexus-accent"
                  style={{ width: `${metric.percent}%` }}
                />
              </div>
              <span className="font-mono text-[10px] text-nexus-muted uppercase">
                {metric.percent}% of allocation
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-nexus-muted uppercase tracking-widest">
            <Download size={14} className="text-nexus-purple" />
            Billing history
          </div>
          <button className="font-mono text-[10px] uppercase tracking-wider text-nexus-purple hover:text-white transition-colors">
            Download all
          </button>
        </div>

        <div className="border border-nexus-gray bg-nexus-dark">
          <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] gap-4 px-6 py-3 border-b border-nexus-gray/40 font-mono text-[10px] text-nexus-muted uppercase tracking-widest">
            <span>Invoice</span>
            <span>Period</span>
            <span>Status</span>
            <span className="text-right">Amount</span>
          </div>
          <div className="divide-y divide-nexus-gray/40">
            {billingHistory.length === 0 ? (
              <div className="px-6 py-6 font-mono text-xs text-nexus-light/60">
                No invoices yet.
              </div>
            ) : (
              billingHistory.map(invoice => (
                <div
                  key={invoice.invoice}
                  className="grid grid-cols-[1.2fr_1fr_1fr_1fr] gap-4 px-6 py-4 items-center font-mono text-sm text-white"
                >
                  <div>
                    <p>{invoice.invoice}</p>
                    <p className="text-[10px] text-nexus-muted uppercase">Billed {invoice.date}</p>
                  </div>
                  <span className="text-nexus-light/70">{invoice.period}</span>
                  <span
                    className={`text-[10px] uppercase tracking-widest ${
                      invoice.status === 'Paid' || invoice.status === 'paid'
                        ? 'text-nexus-accent'
                        : invoice.status === 'Failed' || invoice.status === 'failed'
                          ? 'text-red-400'
                          : 'text-yellow-400'
                    }`}
                  >
                    {invoice.status}
                  </span>
                  <div className="flex items-center justify-end gap-3 text-nexus-light/80">
                    <span>{invoice.amount}</span>
                    {invoice.invoiceUrl ? (
                      <a
                        href={invoice.invoiceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-nexus-muted hover:text-white transition-colors"
                      >
                        <Download size={14} />
                      </a>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
