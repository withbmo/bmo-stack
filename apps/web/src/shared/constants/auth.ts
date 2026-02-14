/**
 * Authentication constants
 * Centralized configuration for auth-related values
 */

// OTP Flow Configuration
export const OTP_CONFIG = {
  STORAGE_KEY: "pytholit_otp_flow",
  EXPIRY_SECONDS: 300, // 5 minutes
  RESEND_COOLDOWN_SECONDS: 60,
  CODE_MAX_LENGTH: 8,
} as const;

// Auth Token Storage
export const AUTH_STORAGE = {
  ACCESS_TOKEN_KEY: "pytholit_access_token",
} as const;

// Form Validation
export const AUTH_VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 256,
  EMAIL_PLACEHOLDER: "dev@nexus.py",
} as const;
