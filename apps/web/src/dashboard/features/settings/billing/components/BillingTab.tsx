import { BILLING_INTERVAL, isPaidPlanId, type Plan } from '@pytholit/contracts';
import { getPlanRank as getConfigPlanRank } from '@pytholit/config';
import {
  ArrowLeft,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  CircleHelp,
  CircleDollarSign,
  CreditCard,
  Download,
  ExternalLink,
  Plus,
  Receipt,
  Wallet,
  Zap,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { type ElementType, type ReactNode, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import {
  Button,
  DashboardPageHeader,
  DynamicSkeletonProvider,
  DynamicSlot,
  DynamicValue,
  Input,
  Skeleton,
} from '@/dashboard/components';
import { useAuth } from '@/shared/auth';
import { BillingIntervalToggle } from '@/shared/components/BillingIntervalToggle';
import { PlanCards, PlanComparisonTable } from '@/shared/components/PlanDisplay';
import {
  cancelScheduledDowngrade,
  cancelSubscription,
  createCheckoutSession,
  createPortalSession,
  createTopupSession,
  finalizeCheckoutSession,
  getInvoices,
  getPaymentMethod,
  getPlans,
  getSubscription,
  invalidateSubscriptionCache,
  type InvoiceResponse,
  type PaymentMethodResponse,
  reactivateSubscription,
  type SubscriptionResponse,
} from '@/shared/lib/billing';

// --- Shared Constants & Styles ---
const LABEL_CLASSES = 'font-mono text-[10px] text-text-primary/80 uppercase tracking-widest';
const VALUE_CLASSES = 'text-sm font-sans font-semibold text-text-primary';
const SUBTITLE_CLASSES = 'mt-1 font-mono text-[10px] text-text-primary/75 uppercase';
const CARD_CLASSES = 'border border-border-default bg-bg-panel';

const TOPUP_PRESETS_USD = [10, 25, 50, 100] as const;
const STATUS_THEME: Record<string, { text: string; bg: string }> = {
  active: { text: 'text-nexus-accent', bg: 'bg-nexus-accent' },
  trialing: { text: 'text-blue-400', bg: 'bg-blue-400' },
  past_due: { text: 'text-yellow-400', bg: 'bg-yellow-400' },
  canceled: { text: 'text-red-400', bg: 'bg-red-400' },
  incomplete: { text: 'text-yellow-400', bg: 'bg-yellow-400' },
};
const DEFAULT_STATUS_THEME = { text: 'text-text-primary', bg: 'bg-text-secondary' };

const INVOICE_STATUS_STYLES: Record<string, string> = {
  paid: 'border-nexus-accent/40 text-nexus-accent bg-nexus-accent/10',
  failed: 'border-red-400/40 text-red-400 bg-red-500/10',
  open: 'border-yellow-400/40 text-yellow-400 bg-yellow-500/10',
};

// --- Formatters & Utilities ---
const formatCurrency = (amount: number, currency = 'USD', showDecimals = true) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
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

const fadeIn = (delay: string) => `animate-in fade-in slide-in-from-bottom-2 duration-300 ${delay}`;

// --- Reusable Sub-Components ---
function CardHeader({
  icon: Icon,
  title,
  rightElement,
}: {
  icon: ElementType;
  title: string;
  rightElement?: ReactNode;
}) {
  return (
    <div className="px-6 py-4 border-b border-border-default flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon size={13} className="text-text-primary/70" />
        <p className={LABEL_CLASSES}>{title}</p>
      </div>
      {rightElement}
    </div>
  );
}

function StatBlock({
  icon: Icon,
  dotClass,
  title,
  value,
  subtitle,
  valueClass,
}: {
  icon?: ElementType;
  dotClass?: string;
  title: string;
  value: ReactNode;
  subtitle: ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="px-6 py-4 transition-colors hover:bg-bg-surface/40">
      <div className="flex items-center gap-2 mb-2">
        {dotClass ? (
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} />
        ) : Icon ? (
          <Icon size={10} className="text-text-primary/70 shrink-0" />
        ) : null}
        <p className={LABEL_CLASSES}>{title}</p>
      </div>
      <p className={`${VALUE_CLASSES} ${valueClass || ''}`}>
        <DynamicValue>{value}</DynamicValue>
      </p>
      <p className={SUBTITLE_CLASSES}>{subtitle}</p>
    </div>
  );
}

type BillingHistoryItem = {
  invoice: string;
  period: string;
  amount: string;
  status: string;
  date: string;
  invoiceUrl: string | null;
};

function InvoiceRow({ invoice, index }: { invoice: BillingHistoryItem; index: number }) {
  const normalizedStatus = invoice.status.toLowerCase();
  const statusStyle =
    INVOICE_STATUS_STYLES[normalizedStatus] ??
    'border-border-default text-text-primary/80 bg-bg-surface';

  return (
    <div
      className="hover:bg-bg-surface transition-colors duration-150 animate-in fade-in"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      {/* Mobile */}
      <div className="md:hidden px-4 py-4 space-y-2 font-mono">
        <div className="flex items-center justify-between">
          <p className="text-text-primary text-sm">{invoice.invoice}</p>
          <span className="text-text-primary text-sm font-semibold">{invoice.amount}</span>
        </div>
        <div className="flex items-center justify-between text-[10px] uppercase text-text-primary/80">
          <span>{invoice.period}</span>
          <span className={`inline-flex border px-2 py-0.5 ${statusStyle}`}>{invoice.status}</span>
        </div>
      </div>
      {/* Desktop */}
      <div className="hidden md:grid grid-cols-[1.5fr_1fr_120px_1fr] gap-4 px-6 py-4 items-center">
        <div>
          <p className="font-mono text-sm text-text-primary">{invoice.invoice}</p>
          <p className="font-mono text-[10px] text-text-primary/75 uppercase mt-0.5">
            {formatDate(invoice.date)}
          </p>
        </div>
        <span className="font-mono text-xs text-text-primary/80">{invoice.period}</span>
        <span
          className={`inline-flex w-fit border px-2 py-1 font-mono text-[10px] uppercase tracking-widest ${statusStyle}`}
        >
          {invoice.status}
        </span>
        <div className="flex items-center justify-end gap-3">
          <span className="font-mono text-sm text-text-primary">{invoice.amount}</span>
          {invoice.invoiceUrl && (
            <a
              href={invoice.invoiceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-text-primary/75 hover:text-text-primary transition-colors"
              title="Download invoice"
            >
              <Download size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Main Tab Component ---
export const BillingTab = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, hydrated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscriptionResponse, setSubscriptionResponse] = useState<SubscriptionResponse | null>(
    null
  );
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [selectedInterval, setSelectedInterval] = useState<'month' | 'year'>('month');
  const [isUpgradeView, setIsUpgradeView] = useState(false);
  const [isStartingCheckout, setIsStartingCheckout] = useState(false);
  const [isFinalizingCheckout, setIsFinalizingCheckout] = useState(false);
  const [topupLoadingAmount, setTopupLoadingAmount] = useState<number | null>(null);
  const [portalLoadingAction, setPortalLoadingAction] = useState<
    'cancel' | 'reactivate' | 'cancel_downgrade' | 'manage' | null
  >(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodResponse | null>(null);
  const [invoiceSearch, setInvoiceSearch] = useState('');
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<'all' | 'paid' | 'open' | 'other'>(
    'all'
  );

  useEffect(() => {
    if (!hydrated || !user) return;
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const [sub, inv, planData, pm] = await Promise.all([
          getSubscription(undefined),
          getInvoices(undefined),
          getPlans(),
          getPaymentMethod(undefined),
        ]);
        if (cancelled) return;
        setSubscriptionResponse(sub);
        setInvoices(inv.items ?? []);
        setPlans(planData);
        setPaymentMethod(pm);
        if (planData.length > 0) {
          const subPlanId = sub?.subscription?.planId ?? null;
          const firstPaidPlanId = planData.find(p => isPaidPlanId(p.id))?.id ?? '';
          const preferredPlanId =
            planData.find(p => isPaidPlanId(p.id) && p.id !== subPlanId)?.id ??
            firstPaidPlanId ??
            planData[0]?.id ??
            '';
          setSelectedPlanId(prev =>
            prev && planData.some(p => p.id === prev) ? prev : preferredPlanId
          );
          if (sub?.subscription?.billingInterval) {
            setSelectedInterval(sub.subscription.billingInterval as 'month' | 'year');
          }
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

  const activePlan = useMemo(() => {
    const subPlanId = subscriptionResponse?.subscription?.planId ?? null;
    if (subPlanId) return plans.find(p => p.id === subPlanId) || null;
    return plans[0] || null;
  }, [plans, subscriptionResponse?.subscription?.planId]);

  const selectedPlan = useMemo(() => {
    if (!plans.length) return null;
    const found = plans.find(p => p.id === selectedPlanId);
    return found ?? activePlan ?? plans[0] ?? null;
  }, [activePlan, plans, selectedPlanId]);

  const paidPlans = useMemo(() => plans.filter(plan => isPaidPlanId(plan.id)), [plans]);

  const currentSubscription = subscriptionResponse?.subscription ?? null;
  const isActive =
    currentSubscription?.status === 'active' || currentSubscription?.status === 'trialing';
  const isSelectedCurrentPlan = Boolean(
    isActive &&
    selectedPlan?.id &&
    selectedPlan.id === currentSubscription?.planId &&
    selectedInterval === (currentSubscription?.billingInterval ?? 'month')
  );
  const currentPlanRank = currentSubscription?.planId
    ? (getConfigPlanRank(currentSubscription.planId) ?? 0)
    : 0;
  const selectedPlanRank = selectedPlan?.id ? (getConfigPlanRank(selectedPlan.id) ?? 0) : 0;
  const isDowngradeSelection = Boolean(
    currentSubscription?.planId &&
      selectedPlan?.id &&
      selectedPlan.id !== currentSubscription.planId &&
      selectedPlanRank < currentPlanRank
  );

  const planLabel = activePlan?.name || (isActive ? 'Active' : 'Free');
  const planPrice = activePlan
    ? `${formatCurrency(activePlan.monthlyPriceCents, 'USD', false)} / month`
    : '$0 / month';
  const nextCharge = currentSubscription?.periodEnd || null;
  const scheduledDowngrade = currentSubscription?.scheduledDowngrade ?? null;
  const scheduledDowngradeLabel = scheduledDowngrade
    ? plans.find(plan => plan.id === scheduledDowngrade.planId)?.displayName ??
      scheduledDowngrade.planId.toUpperCase()
    : null;
  const rawStatus = currentSubscription?.status ?? 'active';
  const cancelAtPeriodEnd = currentSubscription?.cancelAtPeriodEnd ?? false;

  const statusStyleTheme = cancelAtPeriodEnd
    ? { text: 'text-yellow-400', bg: 'bg-yellow-400' }
    : (STATUS_THEME[rawStatus] ?? DEFAULT_STATUS_THEME);
  const statusText = cancelAtPeriodEnd ? 'canceling' : rawStatus.replace(/_/g, ' ');

  const isActivePaidPlan = isActive && activePlan ? isPaidPlanId(activePlan.id) : false;
  const hasPaymentMethod = Boolean(
    paymentMethod &&
    typeof paymentMethod.last4 === 'string' &&
    paymentMethod.last4.trim().length > 0
  );
  const displayPaymentMethod = hasPaymentMethod ? paymentMethod : null;

  const billingHistory = useMemo((): BillingHistoryItem[] => {
    if (invoices.length === 0) return [];
    return invoices.map(inv => ({
      invoice: inv.number,
      period: formatPeriod(
        inv.issuingDate || new Date().toISOString(),
        inv.issuingDate || new Date().toISOString()
      ),
      amount: formatCurrency(inv.amountCents, inv.currency),
      status: inv.status,
      date: inv.issuingDate || '',
      invoiceUrl: inv.pdfUrl ?? null,
    }));
  }, [invoices]);

  const filteredBillingHistory = useMemo(() => {
    const search = invoiceSearch.trim().toLowerCase();
    return billingHistory.filter(invoice => {
      const normalizedStatus = invoice.status.toLowerCase();
      const statusMatch =
        invoiceStatusFilter === 'all'
          ? true
          : invoiceStatusFilter === 'paid'
            ? normalizedStatus === 'paid'
            : invoiceStatusFilter === 'open'
              ? normalizedStatus === 'open'
              : normalizedStatus !== 'paid' && normalizedStatus !== 'open';
      if (!statusMatch) return false;
      if (!search) return true;
      return (
        invoice.invoice.toLowerCase().includes(search) ||
        invoice.period.toLowerCase().includes(search) ||
        invoice.status.toLowerCase().includes(search)
      );
    });
  }, [billingHistory, invoiceSearch, invoiceStatusFilter]);

  const billingStats = useMemo(() => {
    const paidCount = invoices.filter(i => i.status.toLowerCase() === 'paid').length;
    const totalAmountCents = invoices.reduce((sum, i) => sum + (i.amountCents ?? 0), 0);
    return { invoices: invoices.length, paidCount, totalAmountCents };
  }, [invoices]);

  const handleCheckout = async () => {
    if (!hydrated || !user) return;
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
      setIsStartingCheckout(true);
      const interval = selectedInterval === 'year' ? BILLING_INTERVAL.YEAR : BILLING_INTERVAL.MONTH;
      const result = await createCheckoutSession(undefined, selectedPlan.id, interval);

      if (result.requiresPaymentMethod && result.paymentSetupUrl) {
        window.location.href = result.paymentSetupUrl;
        return;
      }
      if (result.url) {
        window.location.href = result.url;
        return;
      }

      toast.info(
        result.status === 'already_active'
          ? 'You are already on this plan.'
          : result.status === 'activated'
            ? 'Plan activated.'
            : result.status === 'requires_payment_method'
              ? 'Please update your payment method to continue.'
              : 'No billing change was needed.'
      );

      setIsUpgradeView(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err?.detail || 'Failed to start checkout');
    } finally {
      setIsStartingCheckout(false);
    }
  };

  const handleOpenUpgradeView = () => {
    if (selectedPlan) {
      setIsUpgradeView(true);
      return;
    }

    if (paidPlans.length === 0) {
      toast.error('No paid plans are available right now.');
      return;
    }

    const currentPlanId = currentSubscription?.planId ?? null;
    const preferredPlanId = paidPlans.find(plan => plan.id !== currentPlanId)?.id ?? paidPlans[0]?.id;
    if (preferredPlanId) {
      setSelectedPlanId(preferredPlanId);
    }
    setIsUpgradeView(true);
  };

  const isPortalLoading = portalLoadingAction !== null;

  const refreshSubscription = async () => {
    invalidateSubscriptionCache();
    const sub = await getSubscription(undefined);
    setSubscriptionResponse(sub);
  };

  const handlePortal = async () => {
    if (!hydrated || !user || isPortalLoading) return;
    try {
      setPortalLoadingAction('manage');
      const { url } = await createPortalSession(undefined);
      window.location.href = url;
    } catch (err: any) {
      toast.error(err?.detail || 'Failed to open billing portal');
      setPortalLoadingAction(null);
    }
  };

  const handleCancelOrReactivate = async () => {
    if (!hydrated || !user || isPortalLoading) return;
    const action = cancelAtPeriodEnd ? 'reactivate' : 'cancel';
    try {
      setPortalLoadingAction(action);
      if (cancelAtPeriodEnd) {
        await reactivateSubscription(undefined);
        toast.success('Subscription reactivated.');
      } else {
        await cancelSubscription(undefined);
        toast.success('Cancellation scheduled for period end.');
      }
      await refreshSubscription();
    } catch (err: any) {
      toast.error(err?.detail || 'Failed to update subscription');
    } finally {
      setPortalLoadingAction(null);
    }
  };

  const handleCancelScheduledDowngrade = async () => {
    if (!hydrated || !user || isPortalLoading) return;
    try {
      setPortalLoadingAction('cancel_downgrade');
      await cancelScheduledDowngrade(undefined);
      toast.success('Scheduled downgrade canceled.');
      await refreshSubscription();
    } catch (err: any) {
      toast.error(err?.detail || 'Failed to cancel scheduled downgrade');
    } finally {
      setPortalLoadingAction(null);
    }
  };

  const handleTopup = async (amountUsd: (typeof TOPUP_PRESETS_USD)[number]) => {
    if (!hydrated || !user || topupLoadingAmount !== null) return;
    try {
      setTopupLoadingAmount(amountUsd);
      const { url } = await createTopupSession(undefined, amountUsd);
      window.location.href = url;
    } catch (err: any) {
      toast.error(err?.detail || 'Failed to start top-up checkout');
      setTopupLoadingAmount(null);
    }
  };


  const skeletonRows = Array.from({ length: 3 }).map((_, idx) => (
    <div
      key={idx}
      className="hidden md:grid grid-cols-[1.5fr_1fr_120px_1fr] gap-4 px-6 py-4 items-center"
    >
      <Skeleton className="h-4 w-36" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-5 w-16" />
      <div className="flex justify-end">
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  ));

  const showEmptyState = !isLoading && plans.length === 0;

  return (
    <DynamicSkeletonProvider loading={isLoading}>
      <div className="space-y-6">
        <DashboardPageHeader
          badge={{ icon: CreditCard, label: 'BILLING' }}
          title="BILLING OVERVIEW"
          subtitle="Control your plan, payment methods, and invoice history"
          variant="minimal"
          className="mb-2 border-0 pb-2"
        />

        {!isUpgradeView && showEmptyState ? (
          <div
            className={`${CARD_CLASSES} p-8 flex flex-col items-center text-center gap-3 ${fadeIn('delay-100')}`}
          >
            <CreditCard size={28} className="text-text-primary/70" />
            <p className={LABEL_CLASSES}>Billing</p>
            <p className="text-text-primary font-sans text-lg font-bold">
              No plan available right now
            </p>
            <p className="font-mono text-xs text-text-primary/75 max-w-sm">
              Your subscription remains active if you already have one. Please check back later.
            </p>
          </div>
        ) : !isUpgradeView ? (
          <>
            {/* ── Plan Card ────────────────────────────────── */}
            <div className={`${CARD_CLASSES} ${fadeIn('delay-75')}`}>
              <div className="px-6 py-5 flex flex-wrap items-start justify-between gap-6 border-b border-border-default">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-border-default bg-bg-surface flex items-center justify-center shrink-0 transition-colors">
                    <Zap size={16} className="text-text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className={LABEL_CLASSES}>Current Plan</p>
                      {scheduledDowngrade && !cancelAtPeriodEnd ? (
                        <span className="inline-flex items-center border border-yellow-400/40 bg-yellow-500/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-yellow-300">
                          Scheduled downgrade
                        </span>
                      ) : null}
                      <div className="relative group/info">
                        <button
                          type="button"
                          className="text-text-primary/70 hover:text-text-primary transition-colors"
                          aria-label="Show plan details"
                        >
                          <CircleHelp size={12} />
                        </button>
                        <div className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-56 -translate-x-1/2 border border-border-default bg-bg-surface p-3 opacity-0 shadow-lg transition-opacity duration-150 group-hover/info:opacity-100">
                          <p className="font-mono text-xs text-text-primary">
                            <DynamicValue>{planPrice}</DynamicValue>
                          </p>
                          <p className="mt-1 font-mono text-xs text-text-primary/75">
                            Credits / Monthly:{' '}
                            <DynamicValue>
                              {activePlan?.monthlyIncludedCredits?.toLocaleString() ?? '0'}
                            </DynamicValue>
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-xl font-sans font-bold text-text-primary leading-none">
                      <DynamicValue>{planLabel}</DynamicValue>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  {isActivePaidPlan && (
                    <Button
                      onClick={handleCancelOrReactivate}
                      variant={cancelAtPeriodEnd ? 'secondary' : 'danger'}
                      size="sm"
                      className="text-[10px] tracking-wider"
                      disabled={isPortalLoading}
                      isLoading={
                        portalLoadingAction === 'cancel' || portalLoadingAction === 'reactivate'
                      }
                    >
                      {cancelAtPeriodEnd ? 'Reactivate' : 'Cancel Plan'}
                    </Button>
                  )}
                  <Button
                    onClick={handleOpenUpgradeView}
                    variant="primary"
                    size="sm"
                    className="text-[10px] tracking-wider"
                    disabled={isLoading || isFinalizingCheckout}
                  >
                    <CircleDollarSign size={14} /> Upgrade Plan
                  </Button>
                </div>
              </div>

              {cancelAtPeriodEnd && (
                <div className="px-6 py-3 border-b border-border-default bg-yellow-500/5 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertTriangle size={13} className="text-yellow-400 shrink-0" />
                  <p className="font-mono text-xs text-yellow-400">
                    Your plan will be cancelled at the end of the current period (
                    {formatDate(nextCharge)}). Access continues until then.
                  </p>
                </div>
              )}

              {!cancelAtPeriodEnd && scheduledDowngrade && (
                <div className="px-6 py-3 border-b border-border-default bg-yellow-500/5 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="flex items-center gap-2">
                    <AlertTriangle size={13} className="text-yellow-400 shrink-0" />
                    <p className="font-mono text-xs text-yellow-400">
                      Downgrade to {scheduledDowngradeLabel} is scheduled for{' '}
                      {formatDate(scheduledDowngrade.effectiveAt)}.
                    </p>
                  </div>
                  <Button
                    onClick={handleCancelScheduledDowngrade}
                    variant="secondary"
                    size="sm"
                    className="text-[10px] tracking-wider shrink-0"
                    disabled={isPortalLoading}
                    isLoading={portalLoadingAction === 'cancel_downgrade'}
                  >
                    Cancel Downgrading
                  </Button>
                </div>
              )}

              <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border-default">
                <StatBlock
                  dotClass={statusStyleTheme.bg}
                  title="Status"
                  value={<span className="capitalize">{statusText}</span>}
                  subtitle={
                    <>
                      Access{' '}
                      <DynamicValue>
                        {currentSubscription?.featureAccessState ?? 'enabled'}
                      </DynamicValue>
                    </>
                  }
                  valueClass={statusStyleTheme.text}
                />
                <StatBlock
                  icon={Calendar}
                  title={cancelAtPeriodEnd ? 'Access Until' : 'Next Charge'}
                  value={formatDate(nextCharge)}
                  subtitle={
                    cancelAtPeriodEnd ? 'Plan canceled at period end' : 'Auto-renewal cycle'
                  }
                />
                <StatBlock
                  icon={Receipt}
                  title="Total Invoiced"
                  value={formatCurrency(billingStats.totalAmountCents, 'USD')}
                  subtitle={
                    <>
                      <DynamicValue>{billingStats.invoices}</DynamicValue> invoices ·{' '}
                      <DynamicValue>{billingStats.paidCount}</DynamicValue> paid
                    </>
                  }
                />
              </div>
            </div>

            {/* ── Payment Method ────────────────────────────── */}
            <div className={`${CARD_CLASSES} ${fadeIn('delay-100')}`}>
              <CardHeader
                icon={CreditCard}
                title="Payment Method"
                rightElement={
                  <Button
                    onClick={handlePortal}
                    variant="primary"
                    size="sm"
                    className="text-[10px] tracking-wider"
                    disabled={isPortalLoading}
                    isLoading={portalLoadingAction === 'manage'}
                  >
                    {portalLoadingAction !== 'manage' && <ExternalLink size={12} />} Manage Billing
                  </Button>
                }
              />
              <div className="px-6 py-5">
                <DynamicSlot
                  skeleton={
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-12 h-8" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  }
                >
                  {displayPaymentMethod ? (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-8 border border-border-default bg-bg-surface flex items-center justify-center shrink-0">
                        <span className="font-mono text-[10px] font-bold text-text-primary uppercase tracking-wider">
                          {(displayPaymentMethod.brand ?? 'card').slice(0, 4)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={VALUE_CLASSES}>
                          •••• •••• •••• {displayPaymentMethod.last4 ?? '••••'}
                        </p>
                        <p className={SUBTITLE_CLASSES}>
                          Expires {String(displayPaymentMethod.expMonth ?? '--').padStart(2, '0')} /{' '}
                          {displayPaymentMethod.expYear ?? '----'}
                        </p>
                      </div>
                      {displayPaymentMethod.isDefault && (
                        <span className="font-mono text-[9px] uppercase px-2 py-0.5 border border-border-default text-text-primary/75">
                          Default
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="py-4 flex flex-col items-center gap-3 text-center animate-in fade-in duration-200">
                      <CreditCard size={24} className="text-text-primary/70 opacity-40" />
                      <p className={LABEL_CLASSES}>No cards found</p>
                    </div>
                  )}
                </DynamicSlot>
              </div>
            </div>

            {/* ── Top-up Credits ─────────────────────────────── */}
            <div className={`${CARD_CLASSES} ${fadeIn('delay-150')}`}>
              <CardHeader icon={Wallet} title="Credit Top-up" />
              <div className="px-6 py-5">
                <p className="font-sans text-sm font-semibold text-text-primary mb-1">
                  Buy one-time credit packs
                </p>
                <p className="font-mono text-xs text-text-primary/75 mb-5">
                  Credits are added immediately after successful checkout.
                </p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {TOPUP_PRESETS_USD.map((amount, i) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handleTopup(amount)}
                      disabled={topupLoadingAmount !== null}
                      style={{ animationDelay: `${150 + i * 40}ms` }}
                      className={`group border border-border-default bg-bg-surface px-4 py-4 text-left transition-all duration-200 hover:border-border-highlight hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none ${fadeIn('')}`}
                    >
                      <div className="flex items-start justify-between">
                        <p className={LABEL_CLASSES}>One-time</p>
                        <Plus
                          size={12}
                          className="text-text-primary/75 group-hover:text-text-primary transition-colors"
                        />
                      </div>
                      <p className="mt-2 text-xl font-sans font-bold text-text-primary">
                        {topupLoadingAmount === amount ? (
                          <span className="font-mono text-sm text-text-primary/75 animate-pulse">
                            Redirecting…
                          </span>
                        ) : (
                          formatCurrency(amount * 100, 'USD', false)
                        )}
                      </p>
                      <p className={SUBTITLE_CLASSES}>{amount * 100} credits</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : null}

        {!isUpgradeView ? (
          <div className={`${CARD_CLASSES} overflow-hidden ${fadeIn('delay-200')}`}>
            <CardHeader
              icon={Download}
              title="Billing History"
              rightElement={
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-0 py-0 text-[10px] uppercase tracking-wider"
                >
                  Download all
                </Button>
              }
            />

            <div className="px-6 py-4 border-b border-border-default grid gap-3 md:grid-cols-[1fr_auto_auto]">
              <Input
                value={invoiceSearch}
                onChange={event => setInvoiceSearch(event.target.value)}
                placeholder="Search invoice number or status…"
                variant="default"
                intent="brand"
                size="sm"
              />
              <select
                value={invoiceStatusFilter}
                onChange={event =>
                  setInvoiceStatusFilter(event.target.value as 'all' | 'paid' | 'open' | 'other')
                }
                className="border border-border-default bg-bg-surface px-3 py-2 font-mono text-xs text-text-primary outline-none focus:border-border-highlight transition-colors"
              >
                <option value="all">All statuses</option>
                <option value="paid">Paid</option>
                <option value="open">Open</option>
                <option value="other">Other</option>
              </select>
              <div className="border border-border-default bg-bg-surface px-3 py-2 font-mono text-xs text-text-primary/80 flex items-center gap-1.5">
                <CheckCircle2 size={11} className="text-text-primary/75" />
                <DynamicValue>{filteredBillingHistory.length}</DynamicValue> results
              </div>
            </div>

            <div className="hidden md:grid grid-cols-[1.5fr_1fr_120px_1fr] gap-4 px-6 py-3 bg-bg-surface border-b border-border-default font-mono text-[10px] text-text-primary/80 uppercase tracking-widest">
              <span>Invoice</span>
              <span>Period</span>
              <span>Status</span>
              <span className="text-right">Amount</span>
            </div>

            <div className="divide-y divide-border-default">
              <DynamicSlot skeleton={<>{skeletonRows}</>}>
                {filteredBillingHistory.length === 0 ? (
                  <div className="px-6 py-10 flex flex-col items-center gap-3 text-center animate-in fade-in duration-200">
                    <Receipt size={24} className="text-text-primary/70 opacity-40" />
                    <p className={LABEL_CLASSES}>No invoices found</p>
                  </div>
                ) : (
                  filteredBillingHistory.map((invoice, i) => (
                    <InvoiceRow key={invoice.invoice} invoice={invoice} index={i} />
                  ))
                )}
              </DynamicSlot>
            </div>
          </div>
        ) : (
          <div className={`${CARD_CLASSES} p-6 md:p-8 animate-in fade-in`}>
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsUpgradeView(false)}
                className="text-[10px] uppercase tracking-wider"
              >
                <ArrowLeft size={12} />
                Back to Billing
              </Button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs text-text-primary/75">
                  Select a plan and billing cycle.
                </p>
                <BillingIntervalToggle value={selectedInterval} onChange={setSelectedInterval} />
              </div>

              {isDowngradeSelection && selectedPlan ? (
                <div className="border border-yellow-400/40 bg-yellow-500/10 px-4 py-3">
                  <p className="font-mono text-xs text-yellow-300 uppercase tracking-wider">
                    Downgrade notice
                  </p>
                  <p className="mt-1 font-mono text-xs text-yellow-200/90">
                    This downgrade to {selectedPlan.displayName} will apply on your next renewal (
                    {formatDate(nextCharge)}). Your current plan remains active until then.
                  </p>
                </div>
              ) : null}

              <PlanCards
                plans={paidPlans}
                interval={selectedInterval}
                className="max-w-6xl mx-auto"
                action={{
                  type: 'button',
                  label: 'Select',
                  onSelect: (planId) => setSelectedPlanId(planId),
                  isSelected: (planId) => selectedPlanId === planId,
                  isCurrent: (planId) =>
                    currentSubscription?.planId === planId &&
                    (currentSubscription?.billingInterval ?? 'month') === selectedInterval,
                }}
              />

              <PlanComparisonTable
                plans={paidPlans}
                interval={selectedInterval}
                collapsible
                defaultCollapsed
                className="mt-8"
              />

              {selectedPlan && !isSelectedCurrentPlan && (
                <div className="border border-border-default bg-bg-surface px-4 py-3 flex items-center justify-between animate-in fade-in slide-in-from-bottom-1 duration-200">
                  <p className={LABEL_CLASSES}>
                    {selectedInterval === 'year' ? 'Annual total' : 'Monthly total'}
                  </p>
                  <p className="font-mono text-sm font-bold text-text-primary">
                    {formatCurrency(
                      selectedInterval === 'year'
                        ? selectedPlan.yearlyPriceCents
                        : selectedPlan.monthlyPriceCents,
                      'USD'
                    )}
                    <span className="text-text-primary/75 font-normal text-xs ml-1">
                      / {selectedInterval === 'year' ? 'year' : 'month'}
                    </span>
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsUpgradeView(false)}
                  disabled={isStartingCheckout}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleCheckout}
                  isLoading={isStartingCheckout}
                  disabled={!selectedPlan || isSelectedCurrentPlan}
                >
                  {isSelectedCurrentPlan ? 'Current Plan' : 'Continue to Checkout'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DynamicSkeletonProvider>
  );
};
