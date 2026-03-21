'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import { Button, EmptyState } from '@/dashboard/components';
import { PageLayout } from '@/dashboard/components/layout';

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
          <Button onClick={reset}>
            Retry
          </Button>
          <Link
            href="/"
            className="font-mono text-xs uppercase tracking-wider text-text-muted hover:text-brand-primary"
          >
            Go home
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
