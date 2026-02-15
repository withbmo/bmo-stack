'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/shared/auth';
import { getCurrentUser } from '@/shared/lib/user';
import { FullScreenLoader } from '@/shared/components/FullScreenLoader';

type AccessState = 'checking' | 'ok' | 'fail' | 'forbidden';

const ROLE_BASE_PERMISSIONS: Record<string, string[]> = {
  admin: [
    'admin.access',
    'admin.users.read',
    'admin.users.write',
    'admin.environments.read',
    'admin.environments.write',
    'admin.deployJobs.read',
    'admin.deployJobs.write',
    'admin.billing.read',
    'admin.billing.write',
  ],
  support: [
    'admin.access',
    'admin.users.read',
    'admin.environments.read',
    'admin.deployJobs.read',
  ],
  billing: ['admin.access', 'admin.billing.read'],
  user: [],
};

function hasPermission(me: Awaited<ReturnType<typeof getCurrentUser>>, required: string[]) {
  if ((me as { isSuperuser?: boolean }).isSuperuser) return true;
  const role = typeof me.role === 'string' ? me.role : 'user';
  const perms = Array.isArray(me.permissions) ? me.permissions : [];
  const effective = new Set<string>([...(ROLE_BASE_PERMISSIONS[role] || []), ...perms]);
  return required.every((p) => effective.has(p));
}

export function ProtectedAdminGuard({
  children,
  requiredPermissions = ['admin.access'],
}: {
  children: React.ReactNode;
  requiredPermissions?: string[];
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
        if (!hasPermission(me, requiredPermissions)) {
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
  }, [hydrated, logout, requiredPermissions, token]);

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

