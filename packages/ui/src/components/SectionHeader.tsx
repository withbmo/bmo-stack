import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '../utils/cn';

export interface SectionHeaderProps {
  /** Short label shown in the badge (e.g. API_PLAYGROUND) */
  badge?: string;
  /** Icon shown next to the badge */
  icon?: LucideIcon;
  /** Main title (can include inline elements e.g. muted text) */
  title: ReactNode;
  /** Description below the title */
  subtitle: string;
  className?: string;
}

export const SectionHeader = ({
  badge,
  icon: Icon,
  title,
  subtitle,
  className = '',
}: SectionHeaderProps) => {
  return (
    <div className={cn('mb-8', className)}>
      {badge && Icon ? (
        <div className="flex items-center gap-2 px-3 py-1 mb-6 border border-brand-primary/50 bg-brand-primary/10 text-brand-primary font-mono text-xs tracking-widest w-fit">
          <Icon size={12} /> {badge}
        </div>
      ) : null}
      <h1 className="text-4xl md:text-5xl font-sans font-bold text-white mb-2">{title}</h1>
      <p className="font-mono text-sm text-text-secondary max-w-2xl">{subtitle}</p>
    </div>
  );
};

SectionHeader.displayName = 'SectionHeader';
