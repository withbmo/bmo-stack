'use client';

import { toast } from '@/ui/system';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/shared/auth';
import { getApiErrorMessage } from '@/shared/lib';

/**
 * OAuth Callback Handler
 *
 * This route handles the OAuth callback from providers (Google, GitHub).
 * Better Auth validates the OAuth state parameter and returns the user
 * to this callback route with either:
 * - Success: User authenticated, refresh session and redirect
 * - Error: OAuth failed (state invalid, profile invalid, etc.)
 *
 * Security:
 * - OAuth state parameter is validated by Better Auth to prevent CSRF attacks
 * - Only trusted callback URLs are accepted (configured in better-auth.config.ts)
 * - Session is refreshed after successful OAuth to hydrate user context
 */
export function CallbackRoute() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshSession } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const nextTarget = useMemo(() => {
    const raw = searchParams.get('next');
    if (!raw) return '/dashboard';
    const trimmed = raw.trim();
    if (!trimmed) return '/dashboard';
    if (!trimmed.startsWith('/')) return '/dashboard';
    if (trimmed.startsWith('//')) return '/dashboard';
    if (trimmed.includes('://')) return '/dashboard';
    return trimmed;
  }, [searchParams]);
  const errorParam = useMemo(() => searchParams.get('error'), [searchParams]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (cancelled) return;
        if (errorParam) {
          const messages: Record<string, string> = {
            oauth_state_invalid: 'Security check failed. Please try signing in again.',
            oauth_profile_invalid: 'OAuth profile data was invalid. Please try again.',
            oauth_email_required:
              'A verified email address is required. Please add/verify an email on your provider account.',
            oauth_provider_rate_limited:
              'OAuth provider rate-limited this request. Please try again in a few minutes.',
            oauth_provider_unreachable:
              'OAuth provider could not be reached. Please try again shortly.',
            oauth_email_unverified:
              'Your email is not verified with the OAuth provider. Please verify it and try again.',
            oauth_login_failed: 'OAuth login failed. Please try again.',
            oauth_failed: 'OAuth login failed. Please try again.',
          };
          const msg = messages[errorParam] ?? 'OAuth login failed. Please try again.';
          setError(msg);
          toast.error(msg);
          return;
        }
        const me = await refreshSession();
        if (!me) {
          throw { detail: 'Not signed in', status: 401 };
        }
        if (me.oauthOnboardingRequired || !me.username) {
          router.replace(`/auth/oauth-onboarding?next=${encodeURIComponent(nextTarget)}`);
          return;
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
      <div className="min-h-[calc(100svh-5rem)] bg-bg-app pt-8 pb-20 px-6">
        <div className="mx-auto max-w-2xl border border-border-default bg-bg-panel/80 p-8 backdrop-blur">
          <h1 className="text-2xl font-sans font-bold mb-3">OAuth callback failed</h1>
          <p className="mb-6 font-mono text-sm text-text-secondary/70">{error}</p>
          <Link
            href="/auth/login"
            className="font-mono text-xs uppercase tracking-wider text-text-muted hover:text-brand-primary"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100svh-5rem)] bg-bg-app pt-8 pb-20 px-6">
      <div className="mx-auto max-w-2xl border border-border-default bg-bg-panel/80 p-8 backdrop-blur">
        <h1 className="text-2xl font-sans font-bold mb-3">Signing you in…</h1>
        <p className="font-mono text-sm text-text-secondary/70">Redirecting to your dashboard.</p>
      </div>
    </div>
  );
}
