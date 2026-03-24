import type { EnabledOAuthProvidersResponse } from '@pytholit/contracts';

import type { ApiError } from './client';
import { API_V1, apiRequest, getApiErrorMessage, getApiFieldErrors } from './client';

const AUTH_PREFIX = `${API_V1}/auth`;
type OAuthProvider = EnabledOAuthProvidersResponse['providers'][number];
const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_COOLDOWN_MS = 60 * 1000;

/**
 * Initiate OAuth login with Better Auth.
 * Makes a POST request to get the OAuth redirect URL, then redirects the user.
 *
 * @param provider - OAuth provider ("google" | "github")
 * @param next - Callback path to redirect after successful auth (e.g., "/dashboard")
 *
 * @example
 * await signInWithOAuth("google", "/dashboard");
 */
export async function signInWithOAuth(provider: OAuthProvider, next?: string): Promise<void> {
  // Always return through the dedicated callback route so the app can
  // consistently hydrate session state and surface OAuth errors.
  const callbackURL =
    typeof window !== 'undefined'
      ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(next || '/dashboard')}`
      : `/auth/callback?next=${encodeURIComponent(next || '/dashboard')}`;

  const response = await apiRequest<{ url: string; redirect: boolean }>(
    `${AUTH_PREFIX}/sign-in/social`,
    {
      method: 'POST',
      body: JSON.stringify({
        provider,
        callbackURL,
      }),
    }
  );

  if (response.url) {
    window.location.href = response.url;
  } else {
    throw new Error('Failed to get OAuth redirect URL');
  }
}

type AuthFlowStatus =
  | { status: 'authenticated' }
  | { status: 'otp_required'; otpExpiresAt: string; nextRequestAt: string };

type OtpSendResponse = {
  status: 'sent';
  otpExpiresAt: string;
  nextRequestAt: string;
};

function buildOtpWindow(now = Date.now()): Pick<OtpSendResponse, 'otpExpiresAt' | 'nextRequestAt'> {
  return {
    otpExpiresAt: new Date(now + OTP_TTL_MS).toISOString(),
    nextRequestAt: new Date(now + OTP_COOLDOWN_MS).toISOString(),
  };
}

function isEmailNotVerifiedError(error: unknown): boolean {
  const apiErr = error as ApiError;
  if (apiErr?.code === 'EMAIL_NOT_VERIFIED') return true;
  const detail = typeof apiErr?.detail === 'string' ? apiErr.detail.toLowerCase() : '';
  return detail.includes('verify') && detail.includes('email');
}

/** Login: email + password → token. */
export async function login(
  email: string,
  password: string,
  captchaToken: string
): Promise<AuthFlowStatus> {
  try {
    await apiRequest<unknown>(`${AUTH_PREFIX}/sign-in/email`, {
      method: 'POST',
      headers: { 'x-captcha-response': captchaToken },
      body: JSON.stringify({
        email,
        password,
        rememberMe: true,
      }),
    });
    return { status: 'authenticated' };
  } catch (error) {
    if (!isEmailNotVerifiedError(error)) throw error;
    const otpWindow = buildOtpWindow();
    return {
      status: 'otp_required',
      otpExpiresAt: otpWindow.otpExpiresAt,
      nextRequestAt: otpWindow.nextRequestAt,
    };
  }
}

/** Sign up: always returns OTP requirement for email verification flow. */
export async function signup(
  email: string,
  password: string,
  username: string,
  firstName: string,
  captchaToken: string,
  lastName?: string
): Promise<AuthFlowStatus> {
  await apiRequest<unknown>(`${AUTH_PREFIX}/sign-up/email`, {
    method: 'POST',
    headers: { 'x-captcha-response': captchaToken },
    body: JSON.stringify({
      email,
      password,
      name: username,
      username,
      firstName,
      lastName,
    }),
  });
  const otp = await sendOtp(email, captchaToken);
  return {
    status: 'otp_required',
    otpExpiresAt: otp.otpExpiresAt,
    nextRequestAt: otp.nextRequestAt,
  };
}

export async function sendOtp(email: string, captchaToken: string): Promise<OtpSendResponse> {
  await apiRequest<unknown>(`${AUTH_PREFIX}/email-otp/send-verification-otp`, {
    method: 'POST',
    headers: { 'x-captcha-response': captchaToken },
    body: JSON.stringify({
      email,
      type: 'email-verification',
    }),
  });
  const otpWindow = buildOtpWindow();
  return {
    status: 'sent',
    otpExpiresAt: otpWindow.otpExpiresAt,
    nextRequestAt: otpWindow.nextRequestAt,
  };
}

export async function verifyOtp(email: string, code: string): Promise<AuthFlowStatus> {
  await apiRequest<unknown>(`${AUTH_PREFIX}/email-otp/verify-email`, {
    method: 'POST',
    body: JSON.stringify({
      email,
      otp: code,
    }),
  });
  return { status: 'authenticated' };
}

export async function forgotPassword(
  email: string,
  redirectTo?: string
): Promise<{ status: boolean; message: string }> {
  await apiRequest<unknown>(`${AUTH_PREFIX}/forget-password`, {
    method: 'POST',
    body: JSON.stringify({ email, redirectTo }),
  });
  return { status: true, message: 'If that email exists, a reset message has been sent.' };
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<{ status: boolean }> {
  await apiRequest<unknown>(`${AUTH_PREFIX}/reset-password`, {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });
  return { status: true };
}

/** Logout: clears server session cookie. */
export async function logout(): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`${AUTH_PREFIX}/sign-out`, {
    method: 'POST',
  });
}

export { getApiErrorMessage, getApiFieldErrors };
export type { ApiError };
