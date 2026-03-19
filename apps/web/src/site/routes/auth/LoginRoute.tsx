'use client';

import type { TurnstileInstance } from '@marsidev/react-turnstile';
import { Turnstile } from '@marsidev/react-turnstile';
import { Button } from '@pytholit/ui/ui';
import { ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { env } from '@/env';
import { useAuth } from '@/shared/auth';
import { useAuthForm } from '@/shared/auth/hooks/useAuthForm';
import { useOAuthProviders } from '@/shared/auth/hooks/useOAuthProviders';
import { type ApiError, getApiErrorMessage, login } from '@/shared/lib/auth';
import { AuthCard } from '@/site/components/auth/AuthCard';
import { AuthHeader } from '@/site/components/auth/AuthHeader';
import { AuthPageLayout } from '@/site/components/auth/AuthPageLayout';
import { AuthPanelLoader } from '@/site/components/auth/AuthPanelLoader';
import { EmailField, PasswordField } from '@/site/components/auth/FormFields';
import { SocialAuthButtons } from '@/site/components/auth/SocialAuthButtons';

const TURNSTILE_SITE_KEY = env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';
const IS_DEV = process.env.NODE_ENV === 'development';

/**
 * CAPTCHA Policy:
 * - Production: CAPTCHA required (bot protection via Cloudflare Turnstile)
 * - Development: CAPTCHA optional (for faster local testing)
 *
 * Rate Limiting Compensation:
 * Backend rate limits apply regardless of CAPTCHA (see auth.controller.ts):
 * - Login: 10 requests per 60 seconds
 * - OTP Send: 5 requests per 60 seconds (with 60s cooldown + hourly/daily limits)
 * - OTP Verify: 10 requests per 60 seconds
 *
 * In development, backend rate limiting is the primary protection.
 * In production, CAPTCHA + rate limiting provide defense-in-depth.
 */

export function LoginRoute() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');
  const { refreshSession, isAuthenticated } = useAuth();

  const { email, setEmail, password, setPassword, isLoading, setIsLoading, clearError } =
    useAuthForm({ mode: 'login' });

  const [turnstileToken, setTurnstileToken] = useState('');
  const { providers: oauthProviders, isLoading: isPanelLoading } = useOAuthProviders();
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const redirectTarget = useMemo(() => {
    if (nextParam && nextParam !== '/login') {
      return nextParam;
    }
    return '/dashboard';
  }, [nextParam]);

  const requireTurnstile = !IS_DEV;

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirectTarget);
    }
  }, [isAuthenticated, redirectTarget, router]);

  const resetTurnstile = useCallback(() => {
    turnstileRef.current?.reset();
    setTurnstileToken('');
  }, []);

  const handleAuthSuccess = useCallback(async () => {
    await refreshSession();
    router.replace(redirectTarget);
  }, [redirectTarget, router, refreshSession]);

  const handleSubmitError = useCallback(async (err: unknown) => {
    const apiErr = err as ApiError;
    const message = getApiErrorMessage(
      err,
      apiErr.status === 400 || apiErr.status === 422
        ? 'Request failed. Please try again.'
        : 'Request failed'
    );

    toast.error(message);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (requireTurnstile && !turnstileToken) {
      toast.error('Please complete the security check.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await login(email, password, turnstileToken);
      if (response.status === 'otp_required') {
        const params = new URLSearchParams({
          email,
          next: redirectTarget,
          type: 'email-verification',
          expiresAt: response.otpExpiresAt,
          nextRequestAt: response.nextRequestAt,
        });
        router.replace(`/auth/verify-otp?${params.toString()}`);
        return;
      }

      await handleAuthSuccess();
    } catch (err) {
      resetTurnstile();
      await handleSubmitError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPageLayout>
      <AuthHeader mode="login" />

      <AuthCard>
        {isPanelLoading ? (
          <AuthPanelLoader label="Loading login..." />
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
              <EmailField value={email} onChange={setEmail} />

              <PasswordField value={password} onChange={setPassword} required />

              {requireTurnstile && TURNSTILE_SITE_KEY ? (
                <div className="flex justify-center">
                  <Turnstile
                    ref={turnstileRef}
                    siteKey={TURNSTILE_SITE_KEY}
                    options={{ theme: 'dark' }}
                    onSuccess={token => setTurnstileToken(token)}
                    onExpire={() => setTurnstileToken('')}
                  />
                </div>
              ) : null}

              <Button type="submit" variant="primary" fullWidth disabled={isLoading} size="sm">
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin shrink-0" />
                    <span>VERIFYING...</span>
                  </>
                ) : (
                  <>
                    LOGIN <ArrowRight size={16} />
                  </>
                )}
              </Button>
            </form>

            <SocialAuthButtons next={redirectTarget} providers={oauthProviders ?? undefined} />
          </>
        )}
      </AuthCard>

      <div className="mt-6 text-center space-y-2">
        <Link
          href="/auth/forgot-password"
          className="block font-mono text-xs text-nexus-muted hover:text-nexus-purple underline decoration-dotted underline-offset-4 transition-colors uppercase tracking-wider"
        >
          Forgot password?
        </Link>
        <Link
          href="/auth/signup"
          className="font-mono text-xs text-nexus-muted hover:text-nexus-purple underline decoration-dotted underline-offset-4 transition-colors uppercase tracking-wider"
        >
          NO ACCOUNT? [REGISTER]
        </Link>
      </div>
    </AuthPageLayout>
  );
}
