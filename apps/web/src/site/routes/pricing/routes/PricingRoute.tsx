'use client';

import { BILLING_INTERVAL, type BillingInterval, type Plan } from '@pytholit/contracts';
import { BackgroundLayers, LoadingState, SectionHeader } from '@pytholit/ui';
import { DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';

import { BillingIntervalToggle } from '@/shared/components/BillingIntervalToggle';
import { PlanCards, PlanComparisonTable } from '@/shared/components/PlanDisplay';
import { getPlans } from '@/shared/lib/billing';

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
              <BillingIntervalToggle
                value={interval === BILLING_INTERVAL.YEAR ? 'year' : 'month'}
                onChange={v => setInterval(v === 'year' ? BILLING_INTERVAL.YEAR : BILLING_INTERVAL.MONTH)}
              />
            </div>
          )}

          {!loading && !error && (
            <PlanCards
              plans={sortedPlans}
              interval={interval}
              action={{ type: 'link', href: '/auth/signup', label: 'Get started' }}
            />
          )}

          {!loading && !error && sortedPlans.length > 0 && (
            <PlanComparisonTable plans={sortedPlans} interval={interval} />
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
