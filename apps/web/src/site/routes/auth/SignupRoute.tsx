'use client';

import type { TurnstileInstance } from '@marsidev/react-turnstile';
import { Turnstile } from '@marsidev/react-turnstile';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';

import { env } from '@/env';
import { useAuth } from '@/shared/auth';
import { useAuthForm } from '@/shared/auth/hooks/useAuthForm';
import { useOAuthProviders } from '@/shared/auth/hooks/useOAuthProviders';
import {
  type ApiError,
  getApiErrorMessage,
  getApiFieldErrors,
  signup,
} from '@/shared/lib/auth';
import { AuthCard } from '@/site/components/auth/AuthCard';
import { AuthHeader } from '@/site/components/auth/AuthHeader';
import { AuthPageLayout } from '@/site/components/auth/AuthPageLayout';
import { AuthPanelLoader } from '@/site/components/auth/AuthPanelLoader';
import { AuthSubmitButton } from '@/site/components/auth/AuthSubmitButton';
import {
  EmailField,
  FirstNameField,
  LastNameField,
  PasswordField,
  UsernameField,
} from '@/site/components/auth/FormFields';
import { SocialAuthButtons } from '@/site/components/auth/SocialAuthButtons';

const TURNSTILE_SITE_KEY = env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';
const IS_DEV = process.env.NODE_ENV === 'development';

export function SignupRoute() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshSession } = useAuth();
  const nextParam = searchParams.get('next');

  // Form state
  const {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    username,
    setUsername,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    passwordMismatch,
    setPasswordMismatch,
    fieldErrors,
    setFieldErrors,
    isLoading,
    setIsLoading,
    validatePasswords,
    validateSignupFields,
    clearError,
  } = useAuthForm({ mode: 'register' });

  // Turnstile (Cloudflare CAPTCHA)
  const [turnstileToken, setTurnstileToken] = useState('');
  const { providers: oauthProviders, isLoading: isPanelLoading } = useOAuthProviders();
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const resetTurnstile = useCallback(() => {
    turnstileRef.current?.reset();
    setTurnstileToken('');
  }, []);

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!IS_DEV && !turnstileToken) {
      toast.error('Please complete the security check.');
      return;
    }

    // Validate fields
    if (!validateSignupFields() || !validatePasswords()) {
      return;
    }

    setIsLoading(true);

    try {
      // Create the account and sign in
      const response = await signup(
        email,
        password,
        username.trim(),
        firstName.trim(),
        turnstileToken,
        lastName.trim() || undefined
      );

      if (response.status === 'otp_required') {
        const params = new URLSearchParams({
          type: 'email-verification',
          email,
          next: nextParam || '/dashboard',
          expiresAt: response.otpExpiresAt,
          nextRequestAt: response.nextRequestAt,
        });
        toast.success('Account created. Verify your email OTP code to continue.');
        router.replace(`/auth/verify-otp?${params.toString()}`);
        return;
      }

      await refreshSession();
      toast.success('Account created successfully.');
      router.replace(nextParam || '/dashboard');
    } catch (err) {
      resetTurnstile();
      handleSubmitError(err as ApiError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitError = (err: unknown) => {
    const apiErr = err as ApiError;
    const message = getApiErrorMessage(
      err,
      apiErr.status === 400 || apiErr.status === 422
        ? 'Request failed. Please try again.'
        : 'Request failed'
    );

    // 400: Username already taken
    if (apiErr.status === 400 && typeof apiErr.detail === 'string') {
      const d = (apiErr.detail as string).toLowerCase();
      if (d.includes('username already taken')) {
        toast.error('Username already taken. Please choose another username.');
        setFieldErrors({ ...fieldErrors, username: 'Username already taken.' });
        return;
      }
    }

    // 422: Validation errors
    if (apiErr.status === 422) {
      const errors = getApiFieldErrors(err);
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        toast.error('Please fix the errors below.');
        return;
      }
    }

    toast.error(message);
  };

  return (
    <AuthPageLayout>
      <AuthHeader mode="register" />

      <AuthCard>
        {isPanelLoading ? (
          <AuthPanelLoader label="Loading signup..." />
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <EmailField value={email} onChange={setEmail} />

              {/* Username Field */}
              <UsernameField
                value={username}
                onChange={setUsername}
                error={fieldErrors.username}
              />

              {/* Name Fields */}
              <FirstNameField
                value={firstName}
                onChange={setFirstName}
                error={fieldErrors.firstName}
              />
              <LastNameField
                value={lastName}
                onChange={setLastName}
                error={fieldErrors.lastName}
              />

              {/* Password Field */}
              <PasswordField value={password} onChange={setPassword} required />

              {/* Confirm Password Field */}
              <PasswordField
                value={confirmPassword}
                onChange={(val) => {
                  setConfirmPassword(val);
                  setPasswordMismatch(false);
                }}
                label="Confirm Password"
                error={passwordMismatch}
              />
              {passwordMismatch && (
                <p className="font-mono text-xs text-red-500">
                  Passwords do not match
                </p>
              )}

              {/* Turnstile */}
              {!IS_DEV && TURNSTILE_SITE_KEY && (
                <div className="flex justify-center">
                  <Turnstile
                    ref={turnstileRef}
                    siteKey={TURNSTILE_SITE_KEY}
                    options={{ theme: 'dark' }}
                    onSuccess={(token) => setTurnstileToken(token)}
                    onExpire={() => setTurnstileToken('')}
                  />
                </div>
              )}

              {/* Submit Button */}
              <AuthSubmitButton type="submit" disabled={isLoading}>
                {isLoading ? (
                  'CREATING ACCOUNT...'
                ) : (
                  <>
                    SIGN UP <ArrowRight size={16} />
                  </>
                )}
              </AuthSubmitButton>
            </form>

            <SocialAuthButtons next={nextParam || '/dashboard'} providers={oauthProviders} />
          </>
        )}
      </AuthCard>

      {/* Footer Navigation */}
      <div className="mt-6 text-center">
        <Link
          href="/auth/login"
          className="font-mono text-xs text-nexus-muted hover:text-nexus-purple underline decoration-dotted underline-offset-4 transition-colors uppercase tracking-wider"
        >
          HAVE ACCOUNT? [LOGIN]
        </Link>
      </div>
    </AuthPageLayout>
  );
}
