'use client';

import { useState, useRef, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Turnstile } from '@marsidev/react-turnstile';
import type { TurnstileInstance } from '@marsidev/react-turnstile';
import { useAuth } from '@/shared/auth';
import { useAuthForm } from '@/shared/auth/hooks/useAuthForm';
import {
  signup,
  sendPublicSignupVerification,
  getApiErrorMessage,
  getApiFieldErrors,
} from '@/shared/lib/auth';
import type { ApiError } from '@/shared/lib/auth';
import { getOtpMeta } from '@/shared/auth/utils/otp';
import { AuthPageLayout } from '@/site/components/auth/AuthPageLayout';
import { AuthCard } from '@/site/components/auth/AuthCard';
import { AuthHeader } from '@/site/components/auth/AuthHeader';
import {
  EmailField,
  UsernameField,
  FullNameField,
  PasswordField,
} from '@/site/components/auth/FormFields';
import { AuthSubmitButton } from '@/site/components/auth/AuthSubmitButton';
import { SocialAuthButtons } from '@/site/components/auth/SocialAuthButtons';

import { env } from '@/env';

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
    fullName,
    setFullName,
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
      await signup(
        email,
        password,
        username.trim(),
        fullName.trim(),
        turnstileToken
      );
      await refreshSession();
      // Email verification is required before accessing the app.
      try {
        const otpResp = await sendPublicSignupVerification(email, turnstileToken);
        const meta = getOtpMeta(otpResp);
        const params = new URLSearchParams({
          type: 'email-verification',
          email,
          next: nextParam || '/dashboard',
        });
        if (meta.expiresAt) params.set('expiresAt', meta.expiresAt);
        if (meta.nextRequestAt) params.set('nextRequestAt', meta.nextRequestAt);
        toast.success('Account created. Verify your email to continue.');
        router.replace(`/auth/verify-otp?${params.toString()}`);
      } catch {
        const params = new URLSearchParams({
          type: 'email-verification',
          email,
          next: nextParam || '/dashboard',
          sendFailed: '1',
        });
        toast.success('Account created. Verify your email to continue.');
        router.replace(`/auth/verify-otp?${params.toString()}`);
      }
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
    <AuthPageLayout
      contentClassName="animate-scan"
      contentStyle={{ animationDuration: '0.5s', animationIterationCount: 1 }}
    >
      <AuthHeader mode="register" showOtpStep={false} />

      <AuthCard>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <EmailField value={email} onChange={setEmail} />

          {/* Username Field */}
          <UsernameField
            value={username}
            onChange={setUsername}
            error={fieldErrors.username}
          />

          {/* Full Name Field */}
          <FullNameField
            value={fullName}
            onChange={setFullName}
            error={fieldErrors.full_name}
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

        <SocialAuthButtons next={nextParam || '/dashboard'} />
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
