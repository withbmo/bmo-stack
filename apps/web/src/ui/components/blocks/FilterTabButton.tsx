import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '../../utils/cn';

export interface FilterTabButtonProps {
  /** Whether this tab is currently active */
  active: boolean;
  /** Click handler */
  onClick: () => void;
  /** Button label text */
  children: ReactNode;
  /** Optional icon to display before the label */
  icon?: LucideIcon;
  /** Optional additional className */
  className?: string;
}

/**
 * Shared filter tab button component used across Hub, Templates, and Deployments.
 *
 * Provides consistent styling for filter/tab buttons with:
 * - Purple active state with optional shadow
 * - Gray inactive state with hover effects
 * - Optional icon support
 */
export const FilterTabButton = ({
  active,
  onClick,
  children,
  icon: Icon,
  className = '',
}: FilterTabButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        // Base styles
        'px-6 py-3 font-mono text-xs font-bold border transition-all whitespace-nowrap tracking-wider',
        // Active state
        active &&
        'bg-brand-primary text-white border-brand-primary shadow-[0_0_10px_rgba(109,40,217,0.4)]',
        // Inactive state
        !active &&
        'bg-bg-surface text-text-secondary border-border-dim hover:text-white hover:border-brand-primary hover:text-brand-primary',
        // Icon spacing if icon is present
        Icon && 'flex items-center gap-2',
        className
      )}
    >
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
};

FilterTabButton.displayName = 'FilterTabButton';
