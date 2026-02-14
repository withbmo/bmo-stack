'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Turnstile } from '@marsidev/react-turnstile';
import type { TurnstileInstance } from '@marsidev/react-turnstile';
import { toast } from 'sonner';
import { useAuth } from '@/shared/auth';
import { useAuthForm } from '@/shared/auth/hooks/useAuthForm';
import { useOtpFlow } from '@/shared/auth/hooks/useOtpFlow';
import {
  getApiErrorMessage,
  login,
  loginWithOtp,
  requestLoginOtp,
  sendPublicSignupVerification,
} from '@/shared/lib/auth';
import type { ApiError } from '@/shared/lib/auth';
import { applyOtpResponse, getOtpMeta } from '@/shared/auth/utils/otp';
import { SocialAuthButtons } from '@/site/components/auth/SocialAuthButtons';
import { AuthPageLayout } from '@/site/components/auth/AuthPageLayout';
import { AuthCard } from '@/site/components/auth/AuthCard';
import { AuthHeader } from '@/site/components/auth/AuthHeader';
import {
  EmailField,
  PasswordField,
  OtpField,
} from '@/site/components/auth/FormFields';
import { AuthSubmitButton } from '@/site/components/auth/AuthSubmitButton';

import { env } from '@/env';

const TURNSTILE_SITE_KEY = env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';
const IS_DEV = process.env.NODE_ENV === 'development';

export function LoginRoute() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');
  const { setToken, isAuthenticated } = useAuth();

  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    setIsLoading,
    loginMethod,
    toggleLoginMethod,
    clearError,
  } = useAuthForm({ mode: 'login' });

  const {
    otpSent,
    otpCode,
    setOtpCode,
    resendSecondsLeft,
    markOtpSent,
    clearFlow: clearOtpFlow,
  } = useOtpFlow({ flowType: 'login' });

  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const redirectTarget = useMemo(() => {
    if (nextParam && nextParam !== '/login') {
      return nextParam;
    }
    return '/dashboard';
  }, [nextParam]);

  const requireTurnstile = loginMethod === 'password' && !IS_DEV;
  const showOtpInput = loginMethod === 'otp' && otpSent;

  useEffect(() => {
    clearError();
  }, [clearError, loginMethod]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirectTarget);
    }
  }, [isAuthenticated, redirectTarget, router]);

  const resetTurnstile = useCallback(() => {
    turnstileRef.current?.reset();
    setTurnstileToken('');
  }, []);

  const handleAuthSuccess = useCallback(
    (accessToken: string) => {
      clearOtpFlow();
      setToken(accessToken);
      router.replace(redirectTarget);
    },
    [clearOtpFlow, redirectTarget, router, setToken]
  );

  const goToOtpVerification = useCallback(
    (sendFailed: boolean, expiresAt?: string | null, nextRequestAt?: string | null) => {
      const params = new URLSearchParams({
        type: 'email-verification',
        email,
        next: redirectTarget,
      });

      if (sendFailed) params.set('sendFailed', '1');
      if (expiresAt) params.set('expiresAt', expiresAt);
      if (nextRequestAt) params.set('nextRequestAt', nextRequestAt);

      router.push(`/auth/verify-otp?${params.toString()}`);
    },
    [email, redirectTarget, router]
  );

  const handleSubmitError = useCallback(
    async (err: unknown) => {
      const apiErr = err as ApiError;
      const message = getApiErrorMessage(
        err,
        apiErr.status === 400 || apiErr.status === 422
          ? 'Request failed. Please try again.'
          : 'Request failed'
      );

      if (apiErr.status === 403) {
        try {
          const response = await sendPublicSignupVerification(email);
          const meta = getOtpMeta(response);
          toast.info(`Email verification required. ${response.message}`);
          goToOtpVerification(false, meta.expiresAt, meta.nextRequestAt);
        } catch (sendErr) {
          const sendError = getApiErrorMessage(
            sendErr,
            'Failed to send verification code'
          );
          toast.error(`Verification failed: ${sendError}`);
          goToOtpVerification(true);
        }
        return;
      }

      toast.error(message);
    },
    [email, goToOtpVerification]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (requireTurnstile && !turnstileToken) {
      toast.error('Please complete the security check.');
      return;
    }

    setIsLoading(true);

    try {
      if (loginMethod === 'password') {
        const { access_token } = await login(email, password, turnstileToken);
        handleAuthSuccess(access_token);
      } else if (!otpSent) {
        const response = await requestLoginOtp(email);
        applyOtpResponse(response, email, markOtpSent);
        toast.success('Code sent to your email.');
      } else {
        const { access_token } = await loginWithOtp(email, otpCode);
        handleAuthSuccess(access_token);
      }
    } catch (err) {
      resetTurnstile();
      await handleSubmitError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchLoginMethod = () => {
    toggleLoginMethod();
    setOtpCode('');
    clearError();
    clearOtpFlow();
    resetTurnstile();
  };

  const handleResendOtp = async () => {
    clearError();
    setIsLoading(true);
    try {
      const response = await requestLoginOtp(email);
      applyOtpResponse(response, email, markOtpSent);
      toast.success(response.message || 'Code sent to your email.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Resend failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (loginMethod === 'otp') {
      return otpSent ? 'VERIFY' : 'SEND CODE';
    }
    return 'LOGIN';
  };

  const getLoadingText = () => {
    if (loginMethod === 'otp' && !otpSent) return 'SENDING...';
    return 'VERIFYING...';
  };

  return (
    <AuthPageLayout
      contentClassName="animate-scan"
      contentStyle={{ animationDuration: '0.5s', animationIterationCount: 1 }}
    >
      <AuthHeader mode="login" showOtpStep={showOtpInput} />

      <AuthCard>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleSwitchLoginMethod}
              className="font-mono text-[10px] text-nexus-muted hover:text-nexus-purple underline decoration-dotted underline-offset-2 uppercase tracking-wider"
            >
              {loginMethod === 'password'
                ? 'Use email code (OTP)'
                : 'Use password'}
            </button>
          </div>

          <EmailField value={email} onChange={setEmail} readOnly={showOtpInput} />

          {showOtpInput ? (
            <OtpField
              value={otpCode}
              onChange={setOtpCode}
              onResend={handleResendOtp}
              resendSecondsLeft={resendSecondsLeft}
              isLoading={isLoading}
              email={email}
            />
          ) : null}

          {!showOtpInput && loginMethod === 'password' ? (
            <PasswordField value={password} onChange={setPassword} required />
          ) : null}

          {requireTurnstile && TURNSTILE_SITE_KEY ? (
            <div className="flex justify-center">
              <Turnstile
                ref={turnstileRef}
                siteKey={TURNSTILE_SITE_KEY}
                options={{ theme: 'dark' }}
                onSuccess={(token) => setTurnstileToken(token)}
                onExpire={() => setTurnstileToken('')}
              />
            </div>
          ) : null}

          <AuthSubmitButton type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin shrink-0" />
                <span>{getLoadingText()}</span>
              </>
            ) : (
              <>
                {getButtonText()} <ArrowRight size={16} />
              </>
            )}
          </AuthSubmitButton>
        </form>

        <SocialAuthButtons />
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
