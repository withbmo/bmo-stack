'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/shared/auth';
import { getApiErrorMessage } from '@/shared/lib';

export function CallbackRoute() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshSession } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const nextTarget = useMemo(() => searchParams.get('next') || '/dashboard', [searchParams]);
  const errorParam = useMemo(() => searchParams.get('error'), [searchParams]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (cancelled) return;
        if (errorParam) {
          throw { detail: errorParam, status: 400 };
        }
        const me = await refreshSession();
        if (!me) {
          throw { detail: 'Not signed in', status: 401 };
        }
        router.replace(nextTarget);
      } catch (err) {
        if (cancelled) return;
        const msg = getApiErrorMessage(err, 'OAuth login failed. Please try again.');
        setError(msg);
        toast.error(msg);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [errorParam, nextTarget, router, refreshSession]);

  if (error) {
    return (
      <div className="min-h-screen bg-nexus-black pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto border border-nexus-gray bg-nexus-dark/80 backdrop-blur p-8">
          <h1 className="text-2xl font-sans font-bold mb-3">OAuth callback failed</h1>
          <p className="font-mono text-sm text-nexus-light/70 mb-6">{error}</p>
          <Link
            href="/auth/login"
            className="font-mono text-xs uppercase tracking-wider text-nexus-muted hover:text-nexus-purple"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nexus-black pt-28 pb-20 px-6">
      <div className="max-w-2xl mx-auto border border-nexus-gray bg-nexus-dark/80 backdrop-blur p-8">
        <h1 className="text-2xl font-sans font-bold mb-3">Signing you in…</h1>
        <p className="font-mono text-sm text-nexus-light/70">Redirecting to your dashboard.</p>
      </div>
    </div>
  );
}
