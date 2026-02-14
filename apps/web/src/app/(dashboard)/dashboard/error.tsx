'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button, EmptyState } from '@/dashboard/components';
import { PageLayout } from '@/shared/components/layout';

export default function DashboardErrorPage({
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
        <EmptyState message="Dashboard error." />
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={reset}>
            Retry
          </Button>
          <Link
            href="/dashboard"
            className="font-mono text-xs text-nexus-muted hover:text-nexus-purple uppercase tracking-wider"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
