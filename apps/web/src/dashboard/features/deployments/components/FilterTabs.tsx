import type { DeploymentStatus } from '@/shared/types';

const FILTER_OPTIONS = ['all', 'live', 'deploying', 'failed', 'stopped'] as const;

interface FilterTabsProps {
  filter: DeploymentStatus | 'all';
  onFilterChange: (filter: DeploymentStatus | 'all') => void;
}

export const FilterTabs = ({ filter, onFilterChange }: FilterTabsProps) => (
  <div className="mb-6 flex flex-wrap gap-2">
    {FILTER_OPTIONS.map(f => (
      <button
        key={f}
        onClick={() => onFilterChange(f)}
        className={`border px-4 py-2 font-mono text-xs font-bold tracking-wider transition-all ${
          filter === f
            ? 'border-brand-primary bg-brand-primary text-white'
            : 'border-border-default bg-bg-app text-text-muted hover:border-brand-primary/50 hover:text-text-primary'
        }`}
      >
        {f === 'all' ? 'ALL' : f.toUpperCase()}
      </button>
    ))}
  </div>
);
