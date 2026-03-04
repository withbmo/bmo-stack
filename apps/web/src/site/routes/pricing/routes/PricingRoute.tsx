'use client';

import { BILLING_INTERVAL, type BillingInterval, type Plan } from '@pytholit/contracts';
import { BackgroundLayers, LoadingState, SectionHeader } from '@pytholit/ui';
import { ArrowRight, Check, DollarSign, Minus } from 'lucide-react';
import { useEffect, useState } from 'react';

import { getPlans } from '@/shared/lib/billing';

type PlanFeatureView = {
  id: string;
  name: string;
  description: string | null;
  valuesByPlanId: Record<string, string>;
};

function formatFeatureValue(value: unknown): string {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') return Number.isInteger(value) ? value.toString() : value.toFixed(2);
  if (typeof value === 'string') return value;
  return '-';
}

function getComparisonRows(plans: Plan[]): PlanFeatureView[] {
  const rowsById = new Map<string, PlanFeatureView>();
  for (const plan of plans) {
    for (const feature of plan.features ?? []) {
      const existing = rowsById.get(feature.id);
      if (!existing) {
        rowsById.set(feature.id, {
          id: feature.id,
          name: feature.name,
          description: feature.description ?? null,
          valuesByPlanId: { [plan.id]: formatFeatureValue(feature.value) },
        });
        continue;
      }
      existing.valuesByPlanId[plan.id] = formatFeatureValue(feature.value);
    }
  }
  return Array.from(rowsById.values()).sort((a, b) => a.name.localeCompare(b.name));
}

function getDisplayPrice(plan: Plan, interval: BillingInterval): number {
  return interval === BILLING_INTERVAL.MONTH ? plan.monthlyPriceCents / 100 : plan.yearlyPriceCents / 100;
}

function getDisplayCredits(plan: Plan, interval: BillingInterval): number {
  return interval === BILLING_INTERVAL.MONTH ? plan.monthlyIncludedCredits : plan.yearlyIncludedCredits;
}

export function PricingRoute() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interval, setInterval] = useState<BillingInterval>(BILLING_INTERVAL.MONTH);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await getPlans();
        if (!cancelled) {
          setPlans(data);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError('Failed to load plans');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const activePlans = plans.filter(plan => plan.isActive);
  const sortedPlans = [...activePlans].sort((a, b) => a.monthlyPriceCents - b.monthlyPriceCents);
  const comparisonRows = getComparisonRows(sortedPlans);
  const comparisonGridColumns = `minmax(240px,1.7fr) repeat(${Math.max(sortedPlans.length, 1)}, minmax(140px,1fr))`;

  return (
    <div className="min-h-screen bg-nexus-black">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <BackgroundLayers />
      </div>
      <section className="relative py-28 px-6 border-b border-nexus-gray overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(109,40,217,0.12),_transparent_55%)]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          <SectionHeader
            badge="DEPLOYMENT MATRICES"
            icon={DollarSign}
            title={
              <>
                Ship faster with <span className="text-nexus-purple">predictable</span> pricing.
              </>
            }
            subtitle="Start free, switch any time. All prices, limits, and features are loaded from our billing catalog."
          />

          {loading && (
            <div className="flex justify-center py-20">
              <LoadingState message="Loading plans..." />
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className="text-red-400 font-mono">
                {error}
              </p>
            </div>
          )}

          {!loading && !error && (
            <div className="flex justify-center mb-10">
              <div className="inline-flex items-center border border-nexus-gray bg-nexus-dark/80 backdrop-blur p-1 relative overflow-hidden group hover:border-nexus-purple/50 transition-colors">
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-nexus-purple opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-nexus-purple opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-nexus-purple opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-nexus-purple opacity-0 group-hover:opacity-100 transition-opacity" />

                <button
                  type="button"
                  onClick={() => setInterval(BILLING_INTERVAL.MONTH)}
                  className={`px-5 py-2 text-xs font-mono uppercase tracking-wider transition relative ${
                    interval === BILLING_INTERVAL.MONTH
                      ? 'bg-nexus-purple text-white'
                      : 'text-nexus-muted hover:text-white'
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setInterval(BILLING_INTERVAL.YEAR)}
                  className={`px-5 py-2 text-xs font-mono uppercase tracking-wider transition relative ${
                    interval === BILLING_INTERVAL.YEAR
                      ? 'bg-nexus-purple text-white'
                      : 'text-nexus-muted hover:text-white'
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {sortedPlans.map((plan) => {
                const isMostPopular = plan.name.toLowerCase() === 'pro';
                return (
                  <div
                    key={plan.id}
                    className={`relative border p-8 backdrop-blur-sm group transition-all duration-300 ${
                      isMostPopular
                        ? 'border-nexus-purple/60 bg-nexus-dark/95 hover:border-nexus-purple hover:-translate-y-1'
                        : 'border-nexus-gray bg-nexus-dark/85 hover:border-nexus-purple/50 hover:-translate-y-1'
                    }`}
                  >
                    {/* Brutalist corner accents */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-nexus-purple pointer-events-none" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-nexus-purple pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-nexus-purple pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-nexus-purple pointer-events-none" />

                    {isMostPopular && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                        <span className="bg-nexus-purple px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-white border border-white/20 inline-block">
                          Most popular
                        </span>
                      </div>
                    )}

                    <div className="relative z-10">
                      <p className="font-mono text-xs uppercase tracking-[0.2em] text-nexus-muted">
                        {plan.displayName}
                      </p>
                      <p className="mt-3 text-5xl font-bold text-white">
                        ${getDisplayPrice(plan, interval).toFixed(0)}
                        <span className="text-sm font-mono text-nexus-muted ml-2">
                          /{interval === BILLING_INTERVAL.MONTH ? 'mo' : 'yr'}
                        </span>
                      </p>
                      <p className="mt-3 text-xs font-mono text-nexus-muted min-h-10 leading-relaxed">
                        {plan.description || 'Flexible plan configuration for your workloads.'}
                      </p>

                      <div className="mt-6 border border-nexus-gray/70 bg-black/40 px-4 py-3">
                        <p className="text-xs font-mono uppercase tracking-wider text-nexus-muted">
                          Included credits
                        </p>
                        <p className="text-2xl font-bold text-white mt-2">
                          {getDisplayCredits(plan, interval).toLocaleString()}
                        </p>
                      </div>

                      <ul className="mt-6 space-y-3">
                        {(plan.features ?? []).slice(0, 5).map(feature => (
                          <li key={`${plan.id}-${feature.id}`} className="flex items-start gap-3 text-xs text-white/80 group-hover:text-white transition-colors">
                            <Check className="w-4 h-4 text-nexus-purple shrink-0 mt-0.5" />
                            <span className="font-mono">{feature.name}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-8 flex justify-center">
                        <a
                          href="/auth/signup"
                          className={`inline-flex items-center gap-2 px-4 py-3 text-xs font-mono uppercase tracking-wider transition border ${
                            isMostPopular
                              ? 'bg-nexus-purple text-white border-nexus-purple hover:bg-nexus-purple/90'
                              : 'bg-transparent text-nexus-purple border-nexus-purple/50 hover:bg-nexus-purple/10 hover:border-nexus-purple'
                          }`}
                        >
                          Get started
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && !error && sortedPlans.length > 0 && (
            <div className="mt-20 max-w-6xl mx-auto border border-nexus-gray bg-nexus-dark/60 backdrop-blur p-6 md:p-8 relative overflow-hidden group hover:border-nexus-purple/50 transition-colors">
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-nexus-purple/50 group-hover:border-nexus-purple transition-colors" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-nexus-purple/50 group-hover:border-nexus-purple transition-colors" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-nexus-purple/50 group-hover:border-nexus-purple transition-colors" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-nexus-purple/50 group-hover:border-nexus-purple transition-colors" />

              <h2 className="font-mono text-xs tracking-[0.2em] text-nexus-muted uppercase mb-6 relative z-10">
                Feature comparison
              </h2>
              <div className="overflow-x-auto">
                <div className="min-w-[780px] space-y-2">
                  <div className="grid gap-2 border border-nexus-gray/70 bg-black/50 p-3" style={{ gridTemplateColumns: comparisonGridColumns }}>
                    <div className="text-xs font-mono uppercase tracking-wider text-nexus-muted">Feature / Limit</div>
                    {sortedPlans.map(plan => (
                      <div key={`head-${plan.id}`} className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
                        {plan.displayName}
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-2 border border-nexus-gray/70 bg-black/30 p-3 hover:border-nexus-purple/30 transition" style={{ gridTemplateColumns: comparisonGridColumns }}>
                    <div className="text-xs font-mono text-white font-semibold">Price ({interval})</div>
                    {sortedPlans.map(plan => (
                      <div key={`price-${plan.id}`} className="text-xs font-mono text-white">
                        ${getDisplayPrice(plan, interval).toFixed(0)}
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-2 border border-nexus-gray/70 bg-black/30 p-3 hover:border-nexus-purple/30 transition" style={{ gridTemplateColumns: comparisonGridColumns }}>
                    <div className="text-xs font-mono text-white font-semibold">
                      Included credits
                    </div>
                    {sortedPlans.map(plan => (
                      <div key={`credits-${plan.id}`} className="text-xs font-mono text-white">
                        {getDisplayCredits(plan, interval).toLocaleString()}
                      </div>
                    ))}
                  </div>

                  {comparisonRows.map(row => (
                    <div key={row.id} className="grid gap-2 border border-nexus-gray/50 bg-black/20 p-3 hover:border-nexus-purple/50 hover:bg-black/40 transition" style={{ gridTemplateColumns: comparisonGridColumns }}>
                      <div>
                        <p className="text-xs font-mono text-white font-semibold">{row.name}</p>
                        {row.description ? (
                          <p className="text-[10px] font-mono text-nexus-muted/70 mt-1">{row.description}</p>
                        ) : null}
                      </div>
                      {sortedPlans.map(plan => {
                        const value = row.valuesByPlanId[plan.id] ?? '-';
                        if (value === 'Yes') {
                          return (
                            <div key={`${row.id}-${plan.id}`} className="flex items-center">
                              <Check className="w-4 h-4 text-nexus-purple" />
                            </div>
                          );
                        }
                        if (value === 'No' || value === '-') {
                          return (
                            <div key={`${row.id}-${plan.id}`} className="flex items-center">
                              <Minus className="w-4 h-4 text-nexus-muted/50" />
                            </div>
                          );
                        }
                        return (
                          <div key={`${row.id}-${plan.id}`} className="text-xs font-mono text-white/80">
                            {value}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-20 text-center">
            <p className="font-mono text-xs text-nexus-muted uppercase tracking-wider">
              All plans include 99.99% uptime SLA and 24/7 support.
            </p>
            <p className="font-mono text-xs text-nexus-muted/80 mt-4 uppercase tracking-wider">
              Need custom limits?{' '}
              <a href="/contact" className="text-nexus-purple hover:text-nexus-purple/80 transition">
                Contact us
              </a>{' '}
              for enterprise pricing.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
