import {
  apiRequest,
  API_BASE,
  API_V1,
  getApiErrorMessage,
  getApiFieldErrors,
} from "./client";
import type { ApiError } from "./client";
import type {
  OTPPurpose as ContractOTPPurpose,
  OTPVerifyResponse as ContractOTPVerifyResponse,
} from "@pytholit/contracts";

/**
 * Get OAuth login URL for redirect.
 *
 * @param provider - OAuth provider ("google" | "github")
 * @returns Full URL to redirect user to for OAuth login
 *
 * @example
 * window.location.href = getOAuthLoginUrl("google");
 */
export function getOAuthLoginUrl(provider: "google" | "github", next?: string): string {
  const base = API_BASE ? `${API_BASE}${API_V1}` : API_V1;
  const url = new URL(`${base}/oauth/${provider}`, typeof window !== "undefined" ? window.location.origin : "http://localhost");
  if (next && next.startsWith("/") && !next.startsWith("//") && !next.includes("://")) {
    url.searchParams.set("next", next);
  }
  // URL() will include origin for relative base; convert back to path+query when API_BASE is empty.
  if (!API_BASE) return `${API_V1}/oauth/${provider}${url.search}`;
  return url.toString();
}

const OAUTH_PREFIX = `${API_V1}/oauth`;

/** Exchange OAuth code for access token (code is from redirect, single-use, 60s TTL). */
export async function exchangeOAuthCode(code: string): Promise<Token> {
  const response = await apiRequest<{
    accessToken: string;
    tokenType: "bearer";
  }>(`${OAUTH_PREFIX}/exchange`, {
    method: "POST",
    body: JSON.stringify({ code }),
  });
  return { access_token: response.accessToken, token_type: response.tokenType };
}

const AUTH_PREFIX = `${API_V1}/auth`;
const OTP_PREFIX = `${API_V1}/otp`;

export interface Token {
  access_token: string;
  token_type: "bearer";
}

export interface SignupResponse {
  access_token: string;
  token_type: "bearer";
}

export type OTPPurpose = ContractOTPPurpose;

/** OTP send/resend response (matches backend). */
export interface OTPSendResponse {
  message: string;
  expiresIn: number;
}

/** OTP verify response (matches `@pytholit/contracts`). */
export type OTPVerifyResponse = ContractOTPVerifyResponse;

/** Login: email + password → token. */
export async function login(
  email: string,
  password: string,
  captchaToken: string
): Promise<Token> {
  const response = await apiRequest<{
    accessToken: string;
    tokenType: "bearer";
  }>(`${AUTH_PREFIX}/login`, {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      captchaToken: captchaToken || "",
    }),
  });

  return { access_token: response.accessToken, token_type: response.tokenType };
}

/** Sign up: email, password, username, fullName → token. */
export async function signup(
  email: string,
  password: string,
  username: string,
  fullName: string,
  captchaToken: string
): Promise<SignupResponse> {
  const response = await apiRequest<{
    accessToken: string;
    tokenType: "bearer";
  }>(`${AUTH_PREFIX}/signup`, {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      username,
      fullName,
      captchaToken: captchaToken || "",
    }),
  });

  return { access_token: response.accessToken, token_type: response.tokenType };
}

/** Send OTP for any purpose to an email address (public). */
export async function sendOtp(
  email: string,
  purpose: OTPPurpose,
  captchaToken?: string
): Promise<OTPSendResponse> {
  return apiRequest<OTPSendResponse>(`${OTP_PREFIX}/send`, {
    method: "POST",
    body: JSON.stringify({ email, purpose, captchaToken }),
  });
}

/** Verify an OTP code */
export async function verifyOtp(
  email: string,
  code: string,
  purpose: OTPPurpose
): Promise<OTPVerifyResponse> {
  return apiRequest<OTPVerifyResponse>(`${OTP_PREFIX}/verify`, {
    method: "POST",
    body: JSON.stringify({ email, code, purpose }),
  });
}

/** Resend OTP - invalidates existing OTP and sends a new one */
export async function resendOtp(
  email: string,
  purpose: OTPPurpose
): Promise<OTPSendResponse> {
  return apiRequest<OTPSendResponse>(`${OTP_PREFIX}/resend`, {
    method: "POST",
    body: JSON.stringify({ email, purpose }),
  });
}

/**
 * Legacy helpers (kept temporarily for UI compatibility).
 * These now use generic OTP endpoints and purposes.
 */

/** Request OTP for passwordless login. */
export async function requestLoginOtp(email: string): Promise<OTPSendResponse> {
  return sendOtp(email, "login_verification");
}

/** Verify OTP and get access token for passwordless login. */
export async function loginWithOtp(email: string, code: string): Promise<Token> {
  const result = await verifyOtp(email, code, "login_verification");
  if (!result.success || !result.token) {
    throw { detail: "OTP verification failed", status: 400 } as ApiError;
  }
  return { access_token: result.token, token_type: "bearer" };
}

/** Send signup verification email to unverified user (public). */
export async function sendPublicSignupVerification(
  email: string,
  captchaToken?: string
): Promise<OTPSendResponse> {
  return sendOtp(email, "email_verification", captchaToken);
}

/** Verify signup OTP and receive access token (public). */
export async function verifyPublicSignupOtp(
  email: string,
  code: string
): Promise<Token> {
  const result = await verifyOtp(email, code, "email_verification");
  if (!result.success || !result.token) {
    throw { detail: "OTP verification failed", status: 400 } as ApiError;
  }
  return { access_token: result.token, token_type: "bearer" };
}

/** Reset password using password-reset token returned from OTP verify. */
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`${AUTH_PREFIX}/reset-password`, {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  });
}

/** Logout: clears server session cookie. */
export async function logout(): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`${AUTH_PREFIX}/logout`, {
    method: "POST",
  });
}

export { getApiErrorMessage, getApiFieldErrors };
export type { ApiError };
