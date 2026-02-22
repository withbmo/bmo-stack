'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/shared/auth';
import { getCurrentUser } from '@/shared/lib/user';
import { FullScreenLoader } from '@/shared/components/FullScreenLoader';

type AccessState = 'checking' | 'ok' | 'fail' | 'forbidden';

/**
 * Check if user has admin access.
 * Backend enforces granular RBAC; frontend only gates on admin membership.
 */
function hasAdminAccess(me: Awaited<ReturnType<typeof getCurrentUser>>): boolean {
  return me.isAdmin === true;
}

export function ProtectedAdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { token, logout, hydrated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<AccessState>('checking');

  const next = useMemo(
    () => `${pathname}${typeof window !== 'undefined' ? window.location.search : ''}`,
    [pathname]
  );

  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      setState('fail');
      return;
    }
    let cancelled = false;
    (async () => {
      setState('checking');
      try {
        const me = await getCurrentUser(token);
        if (cancelled) return;
        if (!me.isEmailVerified) {
          setState('forbidden');
          return;
        }
        if (!hasAdminAccess(me)) {
          setState('forbidden');
          return;
        }
        setState('ok');
      } catch {
        if (cancelled) return;
        logout();
        setState('fail');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hydrated, logout, token]);

  useEffect(() => {
    if (state === 'fail') {
      router.replace(`/auth/login?next=${encodeURIComponent(next)}`);
    } else if (state === 'forbidden') {
      router.replace('/403');
    }
  }, [next, router, state]);

  if (!hydrated) return <FullScreenLoader label="Loading..." />;
  if (state === 'checking') return <FullScreenLoader label="Checking access..." />;
  if (state === 'fail' || state === 'forbidden') return null;
  return <>{children}</>;
}
