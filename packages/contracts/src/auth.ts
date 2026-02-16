/**
 * Authentication-related types and contracts
 */

export interface LoginInput {
  email: string;
  password: string;
  captchaToken: string;
}

export interface SignupInput {
  email: string;
  username: string;
  password: string;
  fullName: string;
  captchaToken: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: 'bearer';
  expiresIn: number;
  user: {
    id: string;
    email: string;
    username: string;
    fullName: string | null;
    firstName: string | null;
    lastName: string | null;
    isEmailVerified: boolean;
  };
}

export interface OAuthProvider {
  provider: 'google' | 'github';
  accountId: string;
  accountEmail: string;
  accessToken: string;
  refreshToken: string | null;
  expiresAt: string | null;
}

export interface OTPSendInput {
  email: string;
  purpose: OTPPurpose;
  captchaToken?: string;
}

export type OTPPurpose = 'email_verification' | 'password_reset' | '2fa' | 'login_verification';

export interface OTPVerifyInput {
  email: string;
  code: string;
  purpose: OTPPurpose;
}

export interface OTPVerifyResponse {
  success: boolean;
  token?: string;
}

export interface ForgotPasswordInput {
  email: string;
  captchaToken: string;
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  fullName: string | null;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  plan: {
    name: string;
    displayName: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    features: any[];
  } | null;
}
