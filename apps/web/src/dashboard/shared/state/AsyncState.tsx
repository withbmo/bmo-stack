import { EmptyState, LoadingState } from '@/ui/blocks';

import { Button } from '@/ui/shadcn/ui/button';

export interface AsyncStateProps {
  isLoading: boolean;
  error?: unknown;
  empty?: boolean;
  loadingMessage?: string;
  emptyMessage?: string;
  errorMessage?: string;
  onRetry?: () => void;
}

export const AsyncState = ({
  isLoading,
  error,
  empty,
  loadingMessage,
  emptyMessage = 'Nothing here yet.',
  errorMessage = 'Failed to load.',
  onRetry,
}: AsyncStateProps) => {
  if (isLoading) {
    return <LoadingState message={loadingMessage} />;
  }

  if (error) {
    return (
      <div className="space-y-3">
        <EmptyState message={errorMessage} />
        {onRetry ? (
          <Button onClick={onRetry}>
            Retry
          </Button>
        ) : null}
      </div>
    );
  }

  if (empty) {
    return <EmptyState message={emptyMessage} />;
  }

  return null;
};

AsyncState.displayName = 'AsyncState';
