/**
 * Auth validation constants
 * Used by class-validator DTOs in dtos/auth.dto.ts
 */
export const AUTH_CONSTANTS = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 256,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 30,
  MAX_EMAIL_LENGTH: 255,
  MAX_NAME_LENGTH: 100,
  USERNAME_REGEX: /^[a-zA-Z0-9_]{3,30}$/,
} as const;
