'use client';

import { Activity, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

import { USAGE_METRICS } from '@/shared/constants/settings';

import { SettingsLayout } from '../shared/components/SettingsLayout';

export const UsageSettingsRoute = () => {
  return (
    <SettingsLayout>
      <Link
        href="/dashboard"
        className="absolute right-6 top-6 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-text-muted transition-colors hover:text-white"
      >
        <ChevronLeft size={16} /> BACK
      </Link>

      <section className="space-y-6">
        <header className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-border-default bg-bg-panel px-3 py-1 font-mono text-[11px] uppercase tracking-[0.24em] text-text-primary/70">
            <Activity size={12} />
            Usage
          </div>
          <h1 className="font-mono text-2xl uppercase tracking-wide text-text-primary">
            Workspace usage overview
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-text-primary/70">
            This screen gives the route a real production-safe destination and a place to plug in
            live quota telemetry when the API is ready.
          </p>
        </header>

        <div className="space-y-4">
          {USAGE_METRICS.map(metric => (
            <article
              key={metric.id}
              className="rounded-2xl border border-border-default bg-bg-panel p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-text-primary/55">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-sm text-text-primary/80">{metric.value}</p>
                </div>
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-text-primary/55">
                  {metric.percent}%
                </p>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-bg-app">
                <div
                  className="h-full rounded-full bg-text-primary transition-[width] duration-300"
                  style={{ width: `${metric.percent}%` }}
                />
              </div>
            </article>
          ))}
        </div>
      </section>
    </SettingsLayout>
  );
};
