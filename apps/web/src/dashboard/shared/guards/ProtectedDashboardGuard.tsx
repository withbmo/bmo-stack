'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/shared/auth';
import { FullScreenLoader } from '@/shared/components/FullScreenLoader';
import { sendPublicSignupVerification } from '@/shared/lib/auth';
import { getOtpMeta } from '@/shared/auth/utils/otp';

export const PageLoader = () => <FullScreenLoader label="Loading..." />;

/**
 * Protects dashboard routes: requires auth, validates token, redirects to login if invalid.
 */
export function ProtectedDashboardGuard({ children }: { children: React.ReactNode }) {
  const { user, logout, hydrated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<'checking' | 'ok' | 'fail' | 'unverified'>('checking');

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
    if (!user.isEmailVerified) {
      setStatus('unverified');
      return;
    }
    setStatus('ok');
  }, [user, hydrated]);

  useEffect(() => {
    if (status === 'fail') {
      router.replace(`/auth/login?next=${encodeURIComponent(next)}`);
    }
  }, [status, router, next]);

  useEffect(() => {
    if (status !== 'unverified' || !user?.email) return;
    (async () => {
      try {
        const resp = await sendPublicSignupVerification(user.email);
        const meta = getOtpMeta(resp);
        const params = new URLSearchParams({
          type: 'email-verification',
          email: user.email,
          next,
          expiresAt: meta.expiresAt || '',
          nextRequestAt: meta.nextRequestAt || '',
        });
        router.replace(`/auth/verify-otp?${params.toString()}`);
      } catch {
        const params = new URLSearchParams({
          type: 'email-verification',
          email: user.email,
          next,
          sendFailed: '1',
        });
        router.replace(`/auth/verify-otp?${params.toString()}`);
      }
    })();
  }, [router, status, user, next]);

  if (!hydrated) return <PageLoader />;
  if (status === 'checking') return <PageLoader />;
  if (status === 'fail') return null; // redirecting
  if (status === 'unverified') return <PageLoader />;
  return <>{children}</>;
}
