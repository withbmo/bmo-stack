import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@pytholit/ui';

export interface DashboardPageHeaderProps {
  /** Badge with icon and label (e.g. { icon: Terminal, label: "DEPLOYMENTS" }) */
  badge?: {
    icon: LucideIcon;
    label: string;
  };
  /** Main title (can be string or ReactNode for inline muted spans) */
  title: ReactNode;
  /** Optional subtitle below the title */
  subtitle?: string;
  /** Optional action buttons or back links */
  actions?: ReactNode;
  /** Visual variant */
  variant?: 'standard' | 'large' | 'minimal';
  /** Additional className for the container */
  className?: string;
}

/**
 * Standardized dashboard page header component.
 */
export const DashboardPageHeader = ({
  badge,
  title,
  subtitle,
  actions,
  variant = 'standard',
  className = '',
}: DashboardPageHeaderProps) => {
  const titleSizeClasses = {
    standard: 'text-4xl md:text-5xl',
    large: 'text-5xl md:text-6xl',
    minimal: 'text-2xl',
  };

  return (
    <div
      className={cn(
        'flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-nexus-gray pb-6',
        className
      )}
    >
      <div>
        {badge && (
          <div className="flex items-center gap-2 text-xs font-mono text-nexus-purple mb-2 tracking-widest uppercase">
            <badge.icon size={12} /> {badge.label}
          </div>
        )}
        <h1 className={cn('font-sans font-bold text-white', titleSizeClasses[variant])}>{title}</h1>
        {subtitle && <p className="font-mono text-sm text-nexus-muted mt-2">{subtitle}</p>}
      </div>

      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
};

DashboardPageHeader.displayName = 'DashboardPageHeader';
