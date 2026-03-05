'use client';

import { Sparkles } from 'lucide-react';

interface BillingIntervalToggleProps {
  value: 'month' | 'year';
  onChange: (value: 'month' | 'year') => void;
}

export function BillingIntervalToggle({ value, onChange }: BillingIntervalToggleProps) {
  return (
    <div className="inline-flex border border-border-default overflow-hidden">
      <button
        type="button"
        onClick={() => onChange('month')}
        className={`px-4 py-2 font-mono text-[10px] uppercase tracking-wider transition-colors ${
          value === 'month'
            ? 'bg-bg-surface text-text-primary'
            : 'bg-bg-panel text-text-secondary hover:text-text-primary'
        }`}
      >
        Monthly
      </button>
      <button
        type="button"
        onClick={() => onChange('year')}
        className={`px-4 py-2 font-mono text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
          value === 'year'
            ? 'bg-bg-surface text-text-primary'
            : 'bg-bg-panel text-text-secondary hover:text-text-primary'
        }`}
      >
        <Sparkles size={9} className={value === 'year' ? 'text-nexus-accent' : 'text-text-secondary'} />
        Yearly
        <span
          className={`font-mono text-[8px] uppercase px-1.5 py-0.5 border transition-colors ${
            value === 'year'
              ? 'border-nexus-accent/40 text-nexus-accent bg-nexus-accent/10'
              : 'border-border-default text-text-secondary'
          }`}
        >
          Save 20%
        </span>
      </button>
    </div>
  );
}
