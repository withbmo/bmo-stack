import { cn } from '../../../utils/cn';

export interface EmptyStateProps {
  /** Message to display */
  message: string;
  /** Additional className */
  className?: string;
}

/**
 * Standardized empty/error state component for dashboard pages.
 *
 * Provides consistent styling:
 * - Bordered panel with semantic tokens
 * - Monospace text styling
 * - Used for "not found", "no results", error messages
 */
export const EmptyState = ({ message, className = '' }: EmptyStateProps) => {
  return (
    <div className={cn('border border-border-dim bg-bg-panel p-6', className)}>
      <span className="font-mono text-xs text-text-secondary">{message}</span>
    </div>
  );
};

EmptyState.displayName = 'EmptyState';
