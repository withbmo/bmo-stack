import { cn } from '@pytholit/ui/ui';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

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
        'mb-8 flex flex-col justify-between gap-6 border-b border-border-default pb-6 md:flex-row md:items-end',
        className
      )}
    >
      <div>
        {badge && (
          <div className="mb-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-brand-primary">
            <badge.icon size={12} /> {badge.label}
          </div>
        )}
        <h1 className={cn('font-sans font-bold text-text-primary', titleSizeClasses[variant])}>
          {title}
        </h1>
        {subtitle && <p className="mt-2 font-mono text-sm text-text-muted">{subtitle}</p>}
      </div>

      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
};

DashboardPageHeader.displayName = 'DashboardPageHeader';
