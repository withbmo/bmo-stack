import { OTP_CONFIG } from '@/common/constants';
import type { OTPSendResponse } from '@/common/lib/auth';

export type OtpMeta = {
  expiresAt: string | null;
  nextRequestAt: string | null;
};

function toExpiresAt(expiresInSeconds: number | null | undefined): string | null {
  if (!expiresInSeconds || expiresInSeconds <= 0) return null;
  return new Date(Date.now() + expiresInSeconds * 1000).toISOString();
}

function toNextRequestAt(): string {
  return new Date(Date.now() + OTP_CONFIG.RESEND_COOLDOWN_SECONDS * 1000).toISOString();
}

export function getOtpMeta(response: OTPSendResponse): OtpMeta {
  return {
    expiresAt: toExpiresAt(response.expiresIn),
    nextRequestAt: toNextRequestAt(),
  };
}

export function applyOtpResponse(
  response: OTPSendResponse,
  email: string,
  markOtpSent: (email: string, expiresAt?: string | null, nextRequestAt?: string | null) => void
): OtpMeta {
  const meta = getOtpMeta(response);
  markOtpSent(email, meta.expiresAt, meta.nextRequestAt);
  return meta;
}
