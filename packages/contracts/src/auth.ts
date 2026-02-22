/**
 * Authentication-related types and contracts
 */
import type { User, UserProfile } from './user';

/**
 * Authentication constants
 * Centralized configuration for auth-related values across the entire app
 */
export const AUTH_STORAGE = {
  ACCESS_TOKEN_KEY: 'pytholit_access_token',
} as const;

/**
 * Form validation constants for authentication
 */
export const AUTH_VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 256,
  EMAIL_PLACEHOLDER: 'dev@nexus.py',
} as const;

export interface LoginInput {
  email: string;
  password: string;
  captchaToken: string;
}

export interface SignupInput {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName?: string;
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
    firstName: string | null;
    lastName: string | null;
    isEmailVerified: boolean;
  };
}

export type AuthFlowStatus =
  | { status: 'authenticated' }
  | { status: 'otp_required'; otpExpiresAt: string; nextRequestAt: string };

export interface OtpSendResponse {
  status: 'sent';
  otpExpiresAt: string;
  nextRequestAt: string;
}

export interface OtpVerifyInput {
  email: string;
  purpose: 'email_verification';
  code: string;
}

export interface CheckPasswordStrengthInput {
  password: string;
}

export interface PasswordStrengthResponse {
  score: number; // 0-4
  label: string; // "Too Weak", "Weak", "Fair", "Strong", "Very Strong"
  crackTime: string; // Human-readable crack time estimate
  feedback: string[]; // Actionable suggestions
  isStrong: boolean; // true if score >= 3
}

// Re-export User and UserProfile for convenience
export type { User, UserProfile };
