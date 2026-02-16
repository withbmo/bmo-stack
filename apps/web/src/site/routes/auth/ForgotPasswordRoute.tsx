'use client';

import type { TurnstileInstance } from '@marsidev/react-turnstile';
import { Turnstile } from '@marsidev/react-turnstile';
import { ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { env } from '@/env';
import { OTP_CONFIG } from '@/shared/constants';
import { useServerTimer } from '@/shared/hooks/useServerTimer';
import {
  getApiErrorMessage,
  resendOtp,
  resetPassword,
  sendOtp,
  verifyOtp,
} from '@/shared/lib/auth';
import { AuthCard } from '@/site/components/auth/AuthCard';
import { AuthHeader } from '@/site/components/auth/AuthHeader';
import { AuthPageLayout } from '@/site/components/auth/AuthPageLayout';
import { AuthSubmitButton } from '@/site/components/auth/AuthSubmitButton';
import { EmailField, OtpField, PasswordField } from '@/site/components/auth/FormFields';

const TURNSTILE_SITE_KEY = env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';
const IS_DEV = process.env.NODE_ENV === 'development';

type Step = 'request' | 'verify' | 'reset';

export function ForgotPasswordRoute() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get('next');
  const redirectTarget = useMemo(() => nextParam || '/auth/login', [nextParam]);

  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const [nextRequestAt, setNextRequestAt] = useState<string | null>(null);
  const { secondsLeft: resendSecondsLeft } = useServerTimer(nextRequestAt);

  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const resetTurnstile = useCallback(() => {
    turnstileRef.current?.reset();
    setTurnstileToken('');
  }, []);

  const bumpResendCooldown = useCallback(() => {
    setNextRequestAt(
      new Date(Date.now() + OTP_CONFIG.RESEND_COOLDOWN_SECONDS * 1000).toISOString()
    );
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    if (!IS_DEV && !turnstileToken) {
      toast.error('Please complete the security check.');
      return;
    }

    setIsLoading(true);
    try {
      const resp = await sendOtp(email, 'password_reset', turnstileToken);
      bumpResendCooldown();
      toast.success(resp.message || 'Code sent to your email.');
      setStep('verify');
    } catch (err) {
      resetTurnstile();
      toast.error(getApiErrorMessage(err, 'Failed to send reset code'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setIsLoading(true);
    try {
      const resp = await resendOtp(email, 'password_reset');
      bumpResendCooldown();
      toast.success(resp.message || 'Code resent.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to resend code'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !code) return;
    setIsLoading(true);
    try {
      const resp = await verifyOtp(email, code, 'password_reset');
      if (!resp.success || !resp.token) {
        toast.error('Invalid or expired code.');
        return;
      }
      setResetToken(resp.token);
      toast.success('Code verified. Set a new password.');
      setStep('reset');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Verification failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetToken) {
      toast.error('Missing reset token. Please restart the flow.');
      setStep('request');
      return;
    }
    if (!newPassword || newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    setIsLoading(true);
    try {
      const resp = await resetPassword(resetToken, newPassword);
      toast.success(resp.message || 'Password reset successfully.');
      router.replace(redirectTarget);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Password reset failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const title =
    step === 'request' ? (
      <>
        RESET <span className="text-nexus-purple">PASSWORD</span>
      </>
    ) : step === 'verify' ? (
      <>
        VERIFY <span className="text-nexus-purple">CODE</span>
      </>
    ) : (
      <>
        SET <span className="text-nexus-purple">NEW PASSWORD</span>
      </>
    );

  const subtitle =
    step === 'request'
      ? 'Request a password reset code'
      : step === 'verify'
        ? 'Enter the OTP code sent to your inbox'
        : 'Choose a new password';

  return (
    <AuthPageLayout>
      <AuthHeader mode="login" showOtpStep={step !== 'request'} title={title} subtitle={subtitle} />

      <AuthCard>
        {step === 'request' ? (
          <form onSubmit={handleSend} className="space-y-4">
            <EmailField value={email} onChange={setEmail} />

            {!IS_DEV && TURNSTILE_SITE_KEY ? (
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

            <AuthSubmitButton type="submit" disabled={isLoading} size="sm">
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin shrink-0" />
                  <span>SENDING...</span>
                </>
              ) : (
                <>
                  SEND CODE <ArrowRight size={16} />
                </>
              )}
            </AuthSubmitButton>
          </form>
        ) : null}

        {step === 'verify' ? (
          <form onSubmit={handleVerify} className="space-y-4">
            <EmailField value={email} onChange={setEmail} readOnly />
            <OtpField
              value={code}
              onChange={setCode}
              onResend={handleResend}
              resendSecondsLeft={resendSecondsLeft}
              isLoading={isLoading}
              email={email}
            />

            <AuthSubmitButton type="submit" disabled={isLoading} size="sm">
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin shrink-0" />
                  <span>VERIFYING...</span>
                </>
              ) : (
                <>
                  VERIFY <ArrowRight size={16} />
                </>
              )}
            </AuthSubmitButton>
          </form>
        ) : null}

        {step === 'reset' ? (
          <form onSubmit={handleReset} className="space-y-4">
            <PasswordField value={newPassword} onChange={setNewPassword} label="New password" />
            <PasswordField
              value={confirmPassword}
              onChange={setConfirmPassword}
              label="Confirm new password"
            />

            <AuthSubmitButton type="submit" disabled={isLoading} size="sm">
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin shrink-0" />
                  <span>UPDATING...</span>
                </>
              ) : (
                <>
                  UPDATE PASSWORD <ArrowRight size={16} />
                </>
              )}
            </AuthSubmitButton>
          </form>
        ) : null}

        <div className="mt-6 flex items-center justify-center gap-6">
          <Link
            href="/auth/login"
            className="font-mono text-xs uppercase tracking-wider text-nexus-muted hover:text-nexus-purple"
          >
            Back to login
          </Link>
          <Link
            href="/auth/signup"
            className="font-mono text-xs uppercase tracking-wider text-nexus-muted hover:text-nexus-purple"
          >
            Create account
          </Link>
        </div>
      </AuthCard>
    </AuthPageLayout>
  );
}
