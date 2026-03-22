'use client';

import type { TurnstileInstance } from '@marsidev/react-turnstile';
import { toast } from '@/ui/system';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Turnstile } from '@marsidev/react-turnstile';
import { Button } from '@/ui/shadcn/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/shadcn/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/ui/shadcn/ui/field';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/ui/shadcn/ui/input-otp';
import { ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { AuthLayout } from '@/site/components/auth/AuthLayout';
import { useAuth } from '@/shared/auth';
import { getApiErrorMessage, sendOtp, verifyOtp } from '@/shared/lib/auth';
import { getTurnstileSiteKey, shouldUseTurnstile } from '@/shared/lib/turnstile';

const TURNSTILE_SITE_KEY = getTurnstileSiteKey();
const OTP_LENGTH = 6;
const DEFAULT_RESEND_SECONDS = 60;
const DEFAULT_EXPIRES_SECONDS = 10 * 60;

function parseIsoMs(value: string | null): number | null {
  if (!value) return null;
  const time = Date.parse(value);
  return Number.isNaN(time) ? null : time;
}

function formatCountdown(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

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
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [nextRequestAtMs, setNextRequestAtMs] = useState<number | null>(() => {
    const queryMs = parseIsoMs(searchParams.get('nextRequestAt'));
    return queryMs ?? Date.now() + DEFAULT_RESEND_SECONDS * 1000;
  });
  const [expiresAtMs, setExpiresAtMs] = useState<number | null>(() => {
    const queryMs = parseIsoMs(searchParams.get('expiresAt'));
    return queryMs ?? Date.now() + DEFAULT_EXPIRES_SECONDS * 1000;
  });

  const canUseCaptcha = shouldUseTurnstile() && Boolean(TURNSTILE_SITE_KEY);
  const timerStorageKey = useMemo(
    () => (email ? `auth:otp-timers:${email}` : null),
    [email]
  );

  useEffect(() => {
    const tick = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(tick);
  }, []);

  useEffect(() => {
    if (!timerStorageKey) return;

    const queryNextMs = parseIsoMs(searchParams.get('nextRequestAt'));
    const queryExpiresMs = parseIsoMs(searchParams.get('expiresAt'));

    let storageNextMs: number | null = null;
    let storageExpiresMs: number | null = null;

    try {
      const raw = window.localStorage.getItem(timerStorageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as { nextRequestAt?: string; expiresAt?: string };
        storageNextMs = parseIsoMs(parsed.nextRequestAt ?? null);
        storageExpiresMs = parseIsoMs(parsed.expiresAt ?? null);
      }
    } catch {
      // Ignore broken storage payloads.
    }

    const nextMs = Math.max(
      queryNextMs ?? 0,
      storageNextMs ?? 0,
      Date.now() + DEFAULT_RESEND_SECONDS * 1000
    );
    const expiresMs = Math.max(
      queryExpiresMs ?? 0,
      storageExpiresMs ?? 0,
      Date.now() + DEFAULT_EXPIRES_SECONDS * 1000
    );

    setNextRequestAtMs(nextMs);
    setExpiresAtMs(expiresMs);
  }, [searchParams, timerStorageKey]);

  useEffect(() => {
    if (!timerStorageKey || !nextRequestAtMs || !expiresAtMs) return;
    try {
      window.localStorage.setItem(
        timerStorageKey,
        JSON.stringify({
          nextRequestAt: new Date(nextRequestAtMs).toISOString(),
          expiresAt: new Date(expiresAtMs).toISOString(),
        })
      );
    } catch {
      // Ignore storage failures (e.g. private mode restrictions).
    }
  }, [expiresAtMs, nextRequestAtMs, timerStorageKey]);

  const resendSecondsLeft = useMemo(() => {
    if (!nextRequestAtMs) return 0;
    return Math.max(0, Math.ceil((nextRequestAtMs - nowMs) / 1000));
  }, [nextRequestAtMs, nowMs]);

  const expirySecondsLeft = useMemo(() => {
    if (!expiresAtMs) return 0;
    return Math.max(0, Math.ceil((expiresAtMs - nowMs) / 1000));
  }, [expiresAtMs, nowMs]);

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
      if (timerStorageKey) {
        window.localStorage.removeItem(timerStorageKey);
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
    if (resendSecondsLeft > 0) {
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
      setNextRequestAtMs(parseIsoMs(resp.nextRequestAt));
      setExpiresAtMs(parseIsoMs(resp.otpExpiresAt));
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
    if (local.length <= 2) return `${local[0] ?? '*'}***@${domain}`;
    return `${local.slice(0, 2)}***@${domain}`;
  }, [email]);

  return (
    <AuthLayout>
      <Card className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Verify email OTP</CardTitle>
          <CardDescription>Enter the 6-digit code sent to {maskedEmail || 'your email'}.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="otp">OTP code</FieldLabel>
                <InputOTP
                  id="otp"
                  maxLength={OTP_LENGTH}
                  value={code}
                  onChange={value => setCode(value.replace(/\D/g, '').slice(0, OTP_LENGTH))}
                >
                  <InputOTPGroup className="w-full justify-center">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                <FieldDescription className="text-center">
                  Code expires in {formatCountdown(expirySecondsLeft)}
                </FieldDescription>
              </Field>

              {canUseCaptcha ? (
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
                <Button type="submit" disabled={loading || code.length !== OTP_LENGTH}>
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify code
                      <ArrowRight size={16} />
                    </>
                  )}
                </Button>
              </Field>

              <Field>
                {resendSecondsLeft > 0 ? (
                  <FieldDescription className="text-center">
                    Resend available in {formatCountdown(resendSecondsLeft)}
                  </FieldDescription>
                ) : (
                  <Button type="button" onClick={handleResend} disabled={resending}>
                    {resending ? 'Sending...' : 'Resend code'}
                  </Button>
                )}
                <FieldDescription className="text-center">
                  Back to <Link href="/auth/login">login</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
