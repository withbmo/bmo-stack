'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button, EmptyState } from '@/dashboard/components';
import { PageLayout } from '@/shared/components/layout';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <PageLayout className="pb-12">
      <div className="space-y-4">
        <EmptyState message="Something went wrong." />
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={reset}>
            Retry
          </Button>
          <Link
            href="/"
            className="font-mono text-xs text-nexus-muted hover:text-nexus-purple uppercase tracking-wider"
          >
            Go home
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
