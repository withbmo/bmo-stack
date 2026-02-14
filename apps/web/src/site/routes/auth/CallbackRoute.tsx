'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/shared/auth';
import { exchangeOAuthCode } from '@/shared/lib/auth';
import { getApiErrorMessage } from '@/shared/lib';
import { toast } from 'sonner';

export function CallbackRoute() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setToken } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const code = useMemo(() => searchParams.get('code'), [searchParams]);
  const nextTarget = useMemo(() => searchParams.get('next') || '/dashboard', [searchParams]);

  useEffect(() => {
    if (!code) return;
    let cancelled = false;
    (async () => {
      try {
        const { access_token } = await exchangeOAuthCode(code);
        if (cancelled) return;
        setToken(access_token);
        router.replace(nextTarget);
      } catch (err) {
        if (cancelled) return;
        const msg = getApiErrorMessage(err, 'OAuth exchange failed. Please try again.');
        setError(msg);
        toast.error(msg);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code, nextTarget, router, setToken]);

  if (!code) {
    return (
      <div className="min-h-screen bg-nexus-black pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto border border-nexus-gray bg-nexus-dark/80 backdrop-blur p-8">
          <h1 className="text-2xl font-sans font-bold mb-3">OAuth callback failed</h1>
          <p className="font-mono text-sm text-nexus-light/70 mb-6">
            Missing code in callback URL. Please try signing in again.
          </p>
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
