'use client';

import { getPlanCredits,getPublicPlans } from '@pytholit/config';
import type { Plan } from '@pytholit/contracts';
import { LoadingState,PricingCard, SectionHeader } from '@pytholit/ui';
import { DollarSign } from 'lucide-react';
import { useMemo } from 'react';

export function PricingRoute() {
  const plans = useMemo<Plan[]>(
    () =>
      getPublicPlans().map((p) => ({
        ...p,
        monthlyCredits: getPlanCredits(p.id, 'month'),
        yearlyCredits: getPlanCredits(p.id, 'year'),
      })),
    []
  );
  const loading = false;
  const error: string | null = null;

  return (
    <div className="min-h-screen bg-nexus-black">
      <section className="relative py-28 px-6">
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
            subtitle="Start free. Scale when you're ready. Cancel anytime."
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {plans.map((plan) => (
                <PricingCard
                  key={plan.id}
                  plan={{
                    id: plan.id,
                    name: plan.name,
                    monthlyPrice: plan.monthlyPrice,
                    yearlyPrice: plan.yearlyPrice,
                    description: plan.description || '',
                    features: plan.features?.map(f => ({
                      name: f.name,
                      included: true,
                    })) || [],
                    recommended: plan.name.toLowerCase() === 'pro',
                  }}
                />
              ))}
            </div>
          )}

          <div className="mt-16 text-center">
            <p className="font-mono text-sm text-nexus-muted">
              All plans include 99.99% uptime SLA and 24/7 support.
            </p>
            <p className="font-mono text-sm text-nexus-muted mt-2">
              Need custom limits?{' '}
              <a href="/contact" className="text-nexus-purple hover:underline">
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
