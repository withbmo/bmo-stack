'use client';

import type { TurnstileInstance } from '@marsidev/react-turnstile';
import { Turnstile } from '@marsidev/react-turnstile';
import { ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { env } from '@/env';
import { useAuth } from '@/shared/auth';
import { getApiErrorMessage, sendOtp, verifyOtp } from '@/shared/lib/auth';
import { AuthCard } from '@/site/components/auth/AuthCard';
import { AuthHeader } from '@/site/components/auth/AuthHeader';
import { AuthPageLayout } from '@/site/components/auth/AuthPageLayout';
import { AuthSubmitButton } from '@/site/components/auth/AuthSubmitButton';

const TURNSTILE_SITE_KEY = env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';
const IS_DEV = process.env.NODE_ENV === 'development';

export function VerifyOtpRoute() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshSession } = useAuth();

  const email = (searchParams.get('email') || '').trim().toLowerCase();
  const next = searchParams.get('next') || '/dashboard';

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const canUseCaptcha = !IS_DEV && TURNSTILE_SITE_KEY;

  const submitDisabled = loading || code.length !== 6 || !email;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Missing email for OTP verification. Please restart login/signup.');
      return;
    }

    setLoading(true);
    try {
      const result = await verifyOtp(email, code);
      if (result.status !== 'authenticated') {
        toast.error('OTP verification requires another step.');
        return;
      }
      await refreshSession();
      router.replace(next);
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'OTP verification failed.'));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error('Missing email for OTP resend.');
      return;
    }
    if (canUseCaptcha && !turnstileToken) {
      toast.error('Please complete the security check first.');
      return;
    }

    setResending(true);
    try {
      const resp = await sendOtp(email, turnstileToken);
      toast.success(`New code sent. Expires at ${new Date(resp.otpExpiresAt).toLocaleTimeString()}.`);
      setCode('');
      if (canUseCaptcha) {
        turnstileRef.current?.reset();
        setTurnstileToken('');
      }
    } catch (err) {
      toast.error(getApiErrorMessage(err, 'Failed to resend OTP.'));
    } finally {
      setResending(false);
    }
  };

  const maskedEmail = useMemo(() => {
    if (!email.includes('@')) return email;
    const [localRaw, domainRaw] = email.split('@');
    const local = localRaw ?? '';
    const domain = domainRaw ?? '';
    if (local.length <= 2) return `${local[0] ?? '*'}*@${domain}`;
    return `${local.slice(0, 2)}***@${domain}`;
  }, [email]);

  return (
    <AuthPageLayout>
      <AuthHeader mode="login" />
      <AuthCard>
        <div className="mb-6 text-center space-y-2">
          <h2 className="font-mono text-sm uppercase tracking-wider text-nexus-light">Verify Email OTP</h2>
          <p className="font-mono text-xs text-nexus-muted">Enter the 6-digit code sent to {maskedEmail || 'your email'}.</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-2">
            <label className="font-mono text-xs text-nexus-purple uppercase tracking-wider">OTP Code</label>
            <input
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full bg-nexus-black border border-nexus-gray px-3 py-3 text-center tracking-[0.4em] font-mono text-sm text-nexus-light"
              placeholder="000000"
              required
            />
          </div>

          {canUseCaptcha ? (
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

          <AuthSubmitButton type="submit" disabled={submitDisabled}>
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin shrink-0" />
                <span>VERIFYING...</span>
              </>
            ) : (
              <>
                VERIFY CODE <ArrowRight size={16} />
              </>
            )}
          </AuthSubmitButton>
        </form>

        <div className="mt-6 text-center space-y-3">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="font-mono text-xs text-nexus-muted hover:text-nexus-purple underline decoration-dotted underline-offset-4 transition-colors uppercase tracking-wider disabled:opacity-60"
          >
            {resending ? 'SENDING...' : 'Resend OTP'}
          </button>
          <div>
            <Link
              href="/auth/login"
              className="font-mono text-xs text-nexus-muted hover:text-nexus-purple underline decoration-dotted underline-offset-4 transition-colors uppercase tracking-wider"
            >
              Back to login
            </Link>
          </div>
        </div>
      </AuthCard>
    </AuthPageLayout>
  );
}
