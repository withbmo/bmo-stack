'use client';

import { BILLING_INTERVAL, type BillingInterval, type Plan } from '@pytholit/contracts';
import { ArrowRight, Check, ChevronDown, ChevronUp, Minus } from 'lucide-react';
import { useState } from 'react';

export type PlanCardAction =
  | { type: 'link'; href: string; label: string }
  | { type: 'button'; label: string; onSelect: (planId: string) => void; isSelected?: (planId: string) => boolean; isCurrent?: (planId: string) => boolean };

type PlanFeatureView = {
  id: string;
  name: string;
  description: string | null;
  valuesByPlanId: Record<string, string>;
};

export function formatFeatureValue(value: unknown): string {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') return Number.isInteger(value) ? value.toString() : value.toFixed(2);
  if (typeof value === 'string') return value;
  return '-';
}

export function getComparisonRows(plans: Plan[]): PlanFeatureView[] {
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

export function getDisplayPrice(plan: Plan, interval: BillingInterval): number {
  return interval === BILLING_INTERVAL.MONTH ? plan.monthlyPriceCents / 100 : plan.yearlyPriceCents / 100;
}

export function getDisplayCredits(plan: Plan, interval: BillingInterval): number {
  return interval === BILLING_INTERVAL.MONTH ? plan.monthlyIncludedCredits : plan.yearlyIncludedCredits;
}

interface PlanCardsProps {
  plans: Plan[];
  interval: BillingInterval;
  action: PlanCardAction;
  className?: string;
}

export function PlanCards({ plans, interval, action, className }: PlanCardsProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${className ?? 'max-w-6xl mx-auto'}`}>
      {plans.map((plan) => {
        const isMostPopular = plan.name.toLowerCase() === 'pro';
        const isSelected = action.type === 'button' && action.isSelected ? action.isSelected(plan.id) : false;
        const isCurrent = action.type === 'button' && action.isCurrent ? action.isCurrent(plan.id) : false;
        const emphasizeActionButton =
          action.type === 'link' ? isMostPopular : isSelected;
        const canFloatOnHover = action.type === 'link';

        return (
          <div
            key={plan.id}
            className={`relative border p-8 backdrop-blur-sm group transition-all duration-300 flex flex-col h-full ${
              isSelected
                ? `border-nexus-purple bg-nexus-dark/95 ${canFloatOnHover ? '-translate-y-1' : ''}`
                : isMostPopular
                  ? `border-nexus-purple/60 bg-nexus-dark/95 hover:border-nexus-purple ${canFloatOnHover ? 'hover:-translate-y-1' : ''}`
                  : `border-nexus-gray bg-nexus-dark/85 hover:border-nexus-purple/50 ${canFloatOnHover ? 'hover:-translate-y-1' : ''}`
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

            <div className="relative z-10 flex h-full flex-col">
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

              <ul className="mt-6 space-y-3 min-h-[160px]">
                {(plan.features ?? []).slice(0, 5).map(feature => (
                  <li key={`${plan.id}-${feature.id}`} className="flex items-start gap-3 text-xs text-white/80 group-hover:text-white transition-colors">
                    <Check className="w-4 h-4 text-nexus-purple shrink-0 mt-0.5" />
                    <span className="font-mono">{feature.name}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex justify-center">
                {action.type === 'link' ? (
                  <a
                    href={action.href}
                    className={`inline-flex items-center gap-2 px-4 py-3 text-xs font-mono uppercase tracking-wider transition border ${
                      isMostPopular
                        ? 'bg-nexus-purple text-white border-nexus-purple hover:bg-nexus-purple/90'
                        : 'bg-transparent text-nexus-purple border-nexus-purple/50 hover:bg-nexus-purple/10 hover:border-nexus-purple'
                    }`}
                  >
                    {action.label}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => action.onSelect(plan.id)}
                    className={`inline-flex items-center gap-2 px-4 py-3 text-xs font-mono uppercase tracking-wider transition border ${
                      emphasizeActionButton
                        ? 'bg-nexus-purple text-white border-nexus-purple hover:bg-nexus-purple/90'
                        : isCurrent
                          ? 'bg-transparent text-white border-nexus-purple/60'
                        : 'bg-transparent text-nexus-purple border-nexus-purple/50 hover:bg-nexus-purple/10 hover:border-nexus-purple'
                    }`}
                  >
                    {isCurrent ? 'Current Plan' : isSelected ? 'Selected' : action.label}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface PlanComparisonTableProps {
  plans: Plan[];
  interval: BillingInterval;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  className?: string;
}

export function PlanComparisonTable({
  plans,
  interval,
  collapsible = false,
  defaultCollapsed = false,
  className,
}: PlanComparisonTableProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const comparisonRows = getComparisonRows(plans);
  const comparisonGridColumns = `minmax(240px,1.7fr) repeat(${Math.max(plans.length, 1)}, minmax(140px,1fr))`;

  return (
    <div className={`mt-20 max-w-6xl mx-auto border border-nexus-gray bg-nexus-dark/60 backdrop-blur p-6 md:p-8 relative overflow-hidden group hover:border-nexus-purple/50 transition-colors ${className ?? ''}`}>
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-nexus-purple/50 group-hover:border-nexus-purple transition-colors" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-nexus-purple/50 group-hover:border-nexus-purple transition-colors" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-nexus-purple/50 group-hover:border-nexus-purple transition-colors" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-nexus-purple/50 group-hover:border-nexus-purple transition-colors" />

      <div className="mb-6 relative z-10 flex items-center justify-between gap-3">
        <h2 className="font-mono text-xs tracking-[0.2em] text-nexus-muted uppercase">
          Feature comparison
        </h2>
        {collapsible ? (
          <button
            type="button"
            onClick={() => setCollapsed(prev => !prev)}
            className="inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-nexus-muted border border-nexus-gray/70 hover:border-nexus-purple/60 hover:text-white transition-colors"
          >
            {collapsed ? 'Compare plans' : 'Hide comparison'}
            {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        ) : null}
      </div>
      {!collapsed ? (
      <div className="overflow-x-auto">
        <div className="min-w-[780px] space-y-2">
          <div className="grid gap-2 border border-nexus-gray/70 bg-black/50 p-3" style={{ gridTemplateColumns: comparisonGridColumns }}>
            <div className="text-xs font-mono uppercase tracking-wider text-nexus-muted">Feature / Limit</div>
            {plans.map(plan => (
              <div key={`head-${plan.id}`} className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
                {plan.displayName}
              </div>
            ))}
          </div>

          <div className="grid gap-2 border border-nexus-gray/70 bg-black/30 p-3 hover:border-nexus-purple/30 transition" style={{ gridTemplateColumns: comparisonGridColumns }}>
            <div className="text-xs font-mono text-white font-semibold">Price ({interval})</div>
            {plans.map(plan => (
              <div key={`price-${plan.id}`} className="text-xs font-mono text-white">
                ${getDisplayPrice(plan, interval).toFixed(0)}
              </div>
            ))}
          </div>

          <div className="grid gap-2 border border-nexus-gray/70 bg-black/30 p-3 hover:border-nexus-purple/30 transition" style={{ gridTemplateColumns: comparisonGridColumns }}>
            <div className="text-xs font-mono text-white font-semibold">
              Included credits
            </div>
            {plans.map(plan => (
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
              {plans.map(plan => {
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
      ) : null}
    </div>
  );
}
