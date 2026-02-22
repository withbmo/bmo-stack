'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/shared/auth';
import { FullScreenLoader } from '@/shared/components/FullScreenLoader';

export const PageLoader = () => <FullScreenLoader label="Loading..." />;

/**
 * Protects dashboard routes: requires auth, redirects to login if invalid.
 */
export function ProtectedDashboardGuard({ children }: { children: React.ReactNode }) {
  const { user, hydrated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<'checking' | 'ok' | 'fail'>('checking');

  const next = useMemo(
    () => `${pathname}${typeof window !== 'undefined' ? window.location.search : ''}`,
    [pathname]
  );

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      setStatus('fail');
      return;
    }
    setStatus('ok');
  }, [user, hydrated]);

  useEffect(() => {
    if (status === 'fail') {
      router.replace(`/auth/login?next=${encodeURIComponent(next)}`);
    }
  }, [status, router, next]);

  if (!hydrated) return <PageLoader />;
  if (status === 'checking') return <PageLoader />;
  if (status === 'fail') return null; // redirecting
  return <>{children}</>;
}
