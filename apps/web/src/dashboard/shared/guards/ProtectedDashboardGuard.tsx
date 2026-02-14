'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/shared/auth';
import { getCurrentUser } from '@/shared/lib/user';
import { FullScreenLoader } from '@/shared/components/FullScreenLoader';
import { sendPublicSignupVerification } from '@/shared/lib/auth';
import { getOtpMeta } from '@/shared/auth/utils/otp';

export const PageLoader = () => <FullScreenLoader label="Loading..." />;

/**
 * Protects dashboard routes: requires auth, validates token, redirects to login if invalid.
 */
export function ProtectedDashboardGuard({ children }: { children: React.ReactNode }) {
  const { token, logout, hydrated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<'checking' | 'ok' | 'fail' | 'unverified'>('checking');
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      setStatus('fail');
      return;
    }
    let cancelled = false;
    (async () => {
      setStatus('checking');
      try {
        const me = await getCurrentUser(token);
        if (cancelled) return;
        if (!me.isEmailVerified) {
          setUnverifiedEmail(me.email);
          setStatus('unverified');
          return;
        }
        setStatus('ok');
      } catch {
        if (cancelled) return;
        logout();
        setStatus('fail');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, logout, hydrated]);

  useEffect(() => {
    if (status === 'fail') {
      const next = `${pathname}${typeof window !== 'undefined' ? window.location.search : ''}`;
      router.replace(`/auth/login?next=${encodeURIComponent(next)}`);
    }
  }, [status, router, pathname]);

  useEffect(() => {
    if (status !== 'unverified' || !unverifiedEmail) return;
    const next = `${pathname}${typeof window !== 'undefined' ? window.location.search : ''}`;
    (async () => {
      try {
        const resp = await sendPublicSignupVerification(unverifiedEmail);
        const meta = getOtpMeta(resp);
        const params = new URLSearchParams({
          type: 'email-verification',
          email: unverifiedEmail,
          next,
          expiresAt: meta.expiresAt || '',
          nextRequestAt: meta.nextRequestAt || '',
        });
        router.replace(`/auth/verify-otp?${params.toString()}`);
      } catch {
        const params = new URLSearchParams({
          type: 'email-verification',
          email: unverifiedEmail,
          next,
          sendFailed: '1',
        });
        router.replace(`/auth/verify-otp?${params.toString()}`);
      }
    })();
  }, [pathname, router, status, unverifiedEmail]);

  if (!hydrated) return <PageLoader />;
  if (status === 'checking') return <PageLoader />;
  if (status === 'fail') return null; // redirecting
  if (status === 'unverified') return <PageLoader />;
  return <>{children}</>;
}
