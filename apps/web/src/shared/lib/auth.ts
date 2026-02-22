import type { ApiError } from "./client";
import {
  API_V1,
  apiRequest,
  getApiErrorMessage,
  getApiFieldErrors,
} from "./client";

const AUTH_PREFIX = `${API_V1}/auth`;
const AUTH_FLOW_PREFIX = `${API_V1}/auth-flow`;
export type OAuthProvider = "google" | "github";

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
      method: "POST",
      body: JSON.stringify({
        provider,
        callbackURL,
      }),
    }
  );
  
  if (response.url) {
    window.location.href = response.url;
  } else {
    throw new Error("Failed to get OAuth redirect URL");
  }
}

/**
 * @deprecated Use signInWithOAuth() instead which properly initiates the OAuth flow
 */
export function getOAuthLoginUrl(_provider: OAuthProvider, _next?: string): string {
  // Better Auth uses POST to /sign-in/social, not a GET redirect
  // This function is kept for backwards compatibility but won't work correctly
  console.warn("getOAuthLoginUrl is deprecated. Use signInWithOAuth() instead.");
  return `${AUTH_PREFIX}/sign-in/social`;
}

export interface Token {
  access_token: string;
  token_type: "bearer";
}

export type AuthFlowStatus =
  | { status: "authenticated" }
  | { status: "otp_required"; otpExpiresAt: string; nextRequestAt: string };

export type OtpSendResponse = {
  status: "sent";
  otpExpiresAt: string;
  nextRequestAt: string;
};

/** Login: email + password → token. */
export async function login(
  email: string,
  password: string,
  captchaToken: string
): Promise<AuthFlowStatus> {
  return apiRequest<AuthFlowStatus>(`${AUTH_FLOW_PREFIX}/login-password`, {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      captchaToken: captchaToken || "",
    }),
  });
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
  return apiRequest<AuthFlowStatus>(`${AUTH_FLOW_PREFIX}/signup-password`, {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      username,
      firstName,
      lastName,
      captchaToken: captchaToken || "",
    }),
  });
}

export async function sendOtp(
  email: string,
  captchaToken: string
): Promise<OtpSendResponse> {
  return apiRequest<OtpSendResponse>(`${AUTH_FLOW_PREFIX}/otp/send`, {
    method: "POST",
    body: JSON.stringify({
      email,
      purpose: "email_verification",
      captchaToken: captchaToken || "",
    }),
  });
}

export async function verifyOtp(email: string, code: string): Promise<AuthFlowStatus> {
  return apiRequest<AuthFlowStatus>(`${AUTH_FLOW_PREFIX}/otp/verify`, {
    method: "POST",
    body: JSON.stringify({
      email,
      code,
      purpose: "email_verification",
    }),
  });
}

export async function forgotPassword(email: string, redirectTo?: string): Promise<{ status: boolean; message: string }> {
  return apiRequest<{ status: boolean; message: string }>(`${AUTH_FLOW_PREFIX}/password/forgot`, {
    method: "POST",
    body: JSON.stringify({ email, redirectTo }),
  });
}

export async function resetPassword(token: string, newPassword: string): Promise<{ status: boolean }> {
  return apiRequest<{ status: boolean }>(`${AUTH_FLOW_PREFIX}/password/reset`, {
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

export async function getEnabledOAuthProviders(): Promise<OAuthProvider[]> {
  const response = await apiRequest<{ providers?: string[] }>(`${AUTH_FLOW_PREFIX}/providers`, {
    method: "GET",
  });
  const providers = Array.isArray(response.providers) ? response.providers : [];
  return providers.filter((p): p is OAuthProvider => p === "google" || p === "github");
}
