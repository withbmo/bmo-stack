import { cn } from '../../../utils/cn';

export interface LoadingStateProps {
  /** Loading message to display */
  message?: string;
  /** Additional className */
  className?: string;
}

/**
 * Standardized loading state component for dashboard pages.
 *
 * Provides consistent styling:
 * - Bordered panel with semantic tokens
 * - Monospace text styling
 * - Default message: "Loading..."
 */
export const LoadingState = ({ message = 'Loading...', className = '' }: LoadingStateProps) => {
  return (
    <div className={cn('border border-border-dim bg-bg-panel p-6', className)}>
      <span className="font-mono text-xs text-text-secondary">{message}</span>
    </div>
  );
};

LoadingState.displayName = 'LoadingState';
