import type { LucideIcon } from 'lucide-react';

import { cn } from '../../utils/cn';

export interface DashboardTab {
  /** Unique value for the tab */
  value: string;
  /** Display label (will be uppercased) */
  label: string;
  /** Optional icon */
  icon?: LucideIcon;
}

export interface DashboardTabsProps {
  /** Array of tab configurations */
  tabs: DashboardTab[];
  /** Currently active tab value */
  active: string;
  /** Callback when tab is clicked */
  onChange: (value: string) => void;
  /** Size variant */
  size?: 'small' | 'large';
  /** Additional className */
  className?: string;
}

/**
 * Standardized dashboard tab/filter component.
 *
 * Provides consistent styling for filter buttons and tabs across all dashboard pages.
 *
 * Sizes:
 * - small: px-3 py-1 text-[10px] (for tight spaces like ProjectDetails, Deployments)
 * - large: px-6 py-3 text-xs (for Templates, Hub pages)
 *
 * Active state: border-brand-primary text-brand-primary bg-brand-primary/10
 * Inactive state: border-border-dim text-text-secondary hover:text-white
 */
export const DashboardTabs = ({
  tabs,
  active,
  onChange,
  size = 'small',
  className = '',
}: DashboardTabsProps) => {
  const sizeClasses = {
    small: 'px-3 py-1 text-[10px]',
    large: 'px-6 py-3 text-xs',
  };

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {tabs.map(tab => {
        const isActive = active === tab.value;
        const Icon = tab.icon;

        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={cn(
              'font-mono uppercase tracking-wider border transition-colors',
              sizeClasses[size],
              size === 'small' ? '' : 'font-bold',
              isActive
                ? 'border-brand-primary text-brand-primary bg-brand-primary/10'
                : 'border-border-dim text-text-secondary hover:text-white',
              Icon ? 'flex items-center gap-2' : ''
            )}
          >
            {Icon && <Icon size={size === 'small' ? 12 : 14} />}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

DashboardTabs.displayName = 'DashboardTabs';
