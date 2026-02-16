'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useAuth } from '@/shared/auth';
import { useOtpFlow } from '@/shared/auth/hooks/useOtpFlow';
import { applyOtpResponse } from '@/shared/auth/utils/otp';
import {
  getApiErrorMessage,
  sendPublicSignupVerification,
  verifyPublicSignupOtp,
} from '@/shared/lib/auth';
import { AuthCard } from '@/site/components/auth/AuthCard';
import { AuthHeader } from '@/site/components/auth/AuthHeader';
import { AuthPageLayout } from '@/site/components/auth/AuthPageLayout';
import { AuthSubmitButton } from '@/site/components/auth/AuthSubmitButton';
import { EmailField, OtpField } from '@/site/components/auth/FormFields';

export function VerifyOtpRoute() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshSession } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const email = useMemo(() => searchParams.get('email') ?? '', [searchParams]);
  const nextTarget = useMemo(
    () => searchParams.get('next') || '/dashboard',
    [searchParams]
  );
  const sendFailed = searchParams.get('sendFailed') === '1';
  const expiresAt = useMemo(() => searchParams.get('expiresAt'), [searchParams]);
  const nextRequestAt = useMemo(
    () => searchParams.get('nextRequestAt'),
    [searchParams]
  );

  const { otpCode, setOtpCode, resendSecondsLeft, markOtpSent } = useOtpFlow({
    flowType: 'signup',
  });

  useEffect(() => {
    if (!email || sendFailed) return;
    if (!nextRequestAt) return;
    markOtpSent(email, expiresAt ?? null, nextRequestAt ?? null);
  }, [email, expiresAt, nextRequestAt, sendFailed, markOtpSent]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Missing email context. Please go back to login.');
      return;
    }

    setSubmitting(true);
    try {
      await verifyPublicSignupOtp(email, otpCode);
      await refreshSession();
      toast.success('Email verified. Redirecting...');
      router.replace(nextTarget);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Verification failed'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error('Missing email context. Please go back to login.');
      return;
    }

    setResending(true);
    try {
      const response = await sendPublicSignupVerification(email);
      applyOtpResponse(response, email, markOtpSent);
      toast.success(response.message || 'Verification code sent.');
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to resend code'));
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthPageLayout>
      <AuthHeader
        mode="register"
        showOtpStep
        title={
          <>
            VERIFY <span className="text-nexus-purple">EMAIL</span>
          </>
        }
        subtitle="Enter the OTP code sent to your inbox"
      />

      <AuthCard>
        {sendFailed && (
          <div className="mb-4 border border-red-500/40 bg-red-500/10 p-3 font-mono text-xs text-red-300">
            Initial OTP send failed. Use resend below.
          </div>
        )}
        <form onSubmit={handleVerify} className="space-y-4">
          <EmailField value={email} onChange={() => {}} readOnly />

          <OtpField
            value={otpCode}
            onChange={setOtpCode}
            onResend={handleResend}
            resendSecondsLeft={resendSecondsLeft}
            isLoading={resending}
            email={email}
          />

          <AuthSubmitButton type="submit" disabled={submitting} size="sm">
            {submitting ? 'VERIFYING...' : <>VERIFY <ArrowRight size={16} /></>}
          </AuthSubmitButton>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/auth/login"
            className="font-mono text-xs text-nexus-muted hover:text-nexus-purple uppercase tracking-wider"
          >
            Back to login
          </Link>
        </div>
      </AuthCard>
    </AuthPageLayout>
  );
}
