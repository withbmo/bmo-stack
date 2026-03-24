import { cn } from '@/ui';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface DashboardPageHeaderProps {
  badge?: {
    icon: LucideIcon;
    label: string;
  };
  title: ReactNode;
  subtitle?: string;
  actions?: ReactNode;
  variant?: 'standard' | 'large' | 'minimal';
  className?: string;
}

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
        'mb-8 flex flex-col justify-between gap-6 rounded-2xl border border-border/70 bg-card/65 p-5 shadow-sm backdrop-blur-sm md:flex-row md:items-end',
        className
      )}
    >
      <div>
        {badge && (
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-primary">
            <badge.icon size={12} /> {badge.label}
          </div>
        )}
        <h1 className={cn('font-semibold tracking-tight text-foreground', titleSizeClasses[variant])}>
          {title}
        </h1>
        {subtitle && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
};

DashboardPageHeader.displayName = 'DashboardPageHeader';
