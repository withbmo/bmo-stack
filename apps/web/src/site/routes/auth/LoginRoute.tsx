'use client';

import type { TurnstileInstance } from '@marsidev/react-turnstile';
import { toast } from '@/ui/system';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { env } from '@/env';
import { Turnstile } from '@marsidev/react-turnstile';
import { Button } from '@/ui/shadcn/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/shadcn/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from '@/ui/shadcn/ui/field';
import { InputWithIcon } from '@/ui/shadcn/ui/input-with-icon';
import { ArrowRight, Chrome, Github, Loader2, LockIcon, MailIcon } from 'lucide-react';
import Link from 'next/link';
import { AuthLayout } from '@/site/components/auth/AuthLayout';
import { useAuth } from '@/shared/auth';
import { useAuthForm } from '@/shared/auth/hooks/useAuthForm';
import { type ApiError, getApiErrorMessage, login, signInWithOAuth } from '@/shared/lib/auth';

const TURNSTILE_SITE_KEY = env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';
const IS_DEV = process.env.NODE_ENV === 'development';

type OAuthButtonProvider = 'github' | 'google';

export function LoginRoute() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');
  const { refreshSession, isAuthenticated } = useAuth();

  const { email, setEmail, password, setPassword, isLoading, setIsLoading, clearError } =
    useAuthForm({ mode: 'login' });

  const [turnstileToken, setTurnstileToken] = useState('');
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

  const handleOAuthSignIn = async (provider: OAuthButtonProvider) => {
    try {
      await signInWithOAuth(provider, redirectTarget);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'OAuth sign-in failed. Please try again.'));
    }
  };

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
    <AuthLayout>
      <Card className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your GitHub or Google account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <Button variant="outline" type="button" onClick={() => handleOAuthSignIn('github')}>
                  <Github size={16} />
                  Login with GitHub
                </Button>
                <Button variant="outline" type="button" onClick={() => handleOAuthSignIn('google')}>
                  <Chrome size={16} />
                  Login with Google
                </Button>
              </Field>

              <FieldSeparator>Or continue with</FieldSeparator>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <InputWithIcon
                  icon={MailIcon}
                  iconLabel="Email"
                  id="email"
                  type="email"
                  placeholder="mexample.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <InputWithIcon
                  icon={LockIcon}
                  iconLabel="Password"
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </Field>

              {requireTurnstile && TURNSTILE_SITE_KEY ? (
                <Field>
                  <Turnstile
                    ref={turnstileRef}
                    siteKey={TURNSTILE_SITE_KEY}
                    options={{ theme: 'dark' }}
                    onSuccess={setTurnstileToken}
                    onExpire={() => setTurnstileToken('')}
                  />
                </Field>
              ) : null}

              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login
                      <ArrowRight size={16} />
                    </>
                  )}
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <Link href="/auth/signup">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
