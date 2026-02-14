import type { DeploymentStatus } from '@/shared/types';

const FILTER_OPTIONS = ['all', 'live', 'deploying', 'failed', 'stopped'] as const;

interface FilterTabsProps {
  filter: DeploymentStatus | 'all';
  onFilterChange: (filter: DeploymentStatus | 'all') => void;
}

export const FilterTabs = ({ filter, onFilterChange }: FilterTabsProps) => (
  <div className="flex flex-wrap gap-2 mb-6">
    {FILTER_OPTIONS.map(f => (
      <button
        key={f}
        onClick={() => onFilterChange(f)}
        className={`px-4 py-2 font-mono text-xs font-bold border transition-all tracking-wider ${
          filter === f
            ? 'bg-nexus-purple text-white border-nexus-purple'
            : 'bg-[#0A0A0A] text-nexus-muted border-nexus-gray hover:text-white hover:border-nexus-purple/50'
        }`}
      >
        {f === 'all' ? 'ALL' : f.toUpperCase()}
      </button>
    ))}
  </div>
);
