import type { ReactNode } from 'react';

import { cn } from '../../utils/cn';

// ─── Variants ─────────────────────────────────────────────────────────────

export type BadgeVariant = 'success' | 'warning' | 'error' | 'muted' | 'purple';

const variantClasses: Record<BadgeVariant, string> = {
  success: 'text-brand-accent border-brand-accent/30 bg-brand-accent/10',
  warning: 'text-state-warning border-state-warning/30 bg-state-warning/10',
  error: 'text-state-error border-state-error/30 bg-state-error/10',
  muted: 'text-text-secondary border-border-dim bg-border-dim/10',
  purple: 'text-brand-primary border-brand-primary/50 bg-brand-primary/10',
};

const baseClass =
  'inline-flex items-center gap-1.5 border px-2 py-1 text-[10px] font-mono font-bold uppercase tracking-wider';

// ─── Base Badge ──────────────────────────────────────────────────────────

export interface BadgeProps {
  variant: BadgeVariant;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const Badge = ({ variant, icon, children, className }: BadgeProps) => (
  <span className={cn(baseClass, variantClasses[variant], className)}>
    {icon}
    {children}
  </span>
);

Badge.displayName = 'Badge';
