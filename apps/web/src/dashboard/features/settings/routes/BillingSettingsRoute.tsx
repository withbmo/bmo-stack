'use client';

import { ChevronLeft, CreditCard } from 'lucide-react';
import Link from 'next/link';

import { SettingsLayout } from '../shared/components/SettingsLayout';

export const BillingSettingsRoute = () => {
  return (
    <SettingsLayout>
      <Link
        href="/dashboard"
        className="absolute top-6 right-6 flex items-center gap-2 text-nexus-muted hover:text-white transition-colors font-mono text-xs uppercase tracking-wider"
      >
        <ChevronLeft size={16} /> BACK
      </Link>

      <section className="space-y-6">
        <header className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-border-default bg-bg-panel px-3 py-1 font-mono text-[11px] uppercase tracking-[0.24em] text-text-primary/70">
            <CreditCard size={12} />
            Billing
          </div>
          <h1 className="font-mono text-2xl uppercase tracking-wide text-text-primary">
            Billing controls are being finalized
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-text-primary/70">
            Subscription management, invoices, and payment methods are not wired yet. This
            placeholder keeps the route stable in production while the backend and provider setup
            are completed.
          </p>
        </header>

        <div className="rounded-2xl border border-border-default bg-bg-panel p-6">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-text-primary/55">
            Recommended next step
          </p>
          <p className="mt-3 text-sm leading-6 text-text-primary/75">
            Connect this screen to your billing provider webhooks, invoice history, and plan change
            actions before exposing paid plans publicly.
          </p>
        </div>
      </section>
    </SettingsLayout>
  );
};
