import { z } from 'zod';

/**
 * Auth validation constants
 */
export const AUTH_CONSTANTS = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 256,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 30,
  MAX_EMAIL_LENGTH: 255,
  MAX_FULLNAME_LENGTH: 100,
  USERNAME_REGEX: /^[a-zA-Z0-9_]{3,30}$/,
} as const;

/**
 * Base field schemas
 */
export const authFieldSchemas = {
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address')
    .max(AUTH_CONSTANTS.MAX_EMAIL_LENGTH, 'Email is too long'),

  username: z
    .string({ required_error: 'Username is required' })
    .min(
      AUTH_CONSTANTS.MIN_USERNAME_LENGTH,
      `Username must be at least ${AUTH_CONSTANTS.MIN_USERNAME_LENGTH} characters`
    )
    .max(
      AUTH_CONSTANTS.MAX_USERNAME_LENGTH,
      `Username must be at most ${AUTH_CONSTANTS.MAX_USERNAME_LENGTH} characters`
    )
    .regex(
      AUTH_CONSTANTS.USERNAME_REGEX,
      'Username can only contain letters, numbers, and underscores'
    ),

  password: z
    .string({ required_error: 'Password is required' })
    .min(
      AUTH_CONSTANTS.MIN_PASSWORD_LENGTH,
      `Password must be at least ${AUTH_CONSTANTS.MIN_PASSWORD_LENGTH} characters`
    )
    .max(
      AUTH_CONSTANTS.MAX_PASSWORD_LENGTH,
      `Password must be at most ${AUTH_CONSTANTS.MAX_PASSWORD_LENGTH} characters`
    ),

  fullName: z
    .string({ required_error: 'Full name is required' })
    .min(1, 'Full name is required')
    .max(AUTH_CONSTANTS.MAX_FULLNAME_LENGTH, 'Full name is too long'),

  captchaToken: z.string({ required_error: 'Captcha token is required' }).min(1),

  otpCode: z
    .string({ required_error: 'OTP code is required' })
    .length(6, 'OTP code must be 6 digits')
    .regex(/^\d{6}$/, 'OTP code must contain only digits'),
};

/**
 * Login schema
 */
export const loginSchema = z.object({
  email: authFieldSchemas.email,
  password: authFieldSchemas.password,
  captchaToken: authFieldSchemas.captchaToken,
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Signup schema
 */
export const signupSchema = z.object({
  email: authFieldSchemas.email,
  username: authFieldSchemas.username,
  password: authFieldSchemas.password,
  fullName: authFieldSchemas.fullName,
  captchaToken: authFieldSchemas.captchaToken,
});

export type SignupInput = z.infer<typeof signupSchema>;

/**
 * OTP schemas
 */
export const otpPurposeSchema = z.enum([
  'email_verification',
  'password_reset',
  '2fa',
  'login_verification',
]);

export const sendOtpSchema = z.object({
  email: authFieldSchemas.email,
  purpose: otpPurposeSchema,
  captchaToken: authFieldSchemas.captchaToken.optional(),
});

export type SendOtpInput = z.infer<typeof sendOtpSchema>;

export const verifyOtpSchema = z.object({
  email: authFieldSchemas.email,
  code: authFieldSchemas.otpCode,
  purpose: otpPurposeSchema,
});

export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;

/**
 * Password reset schemas
 */
export const forgotPasswordSchema = z.object({
  email: authFieldSchemas.email,
  captchaToken: authFieldSchemas.captchaToken,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  token: z.string({ required_error: 'Token is required' }),
  newPassword: authFieldSchemas.password,
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/**
 * Change password schema
 */
export const changePasswordSchema = z.object({
  currentPassword: authFieldSchemas.password,
  newPassword: authFieldSchemas.password,
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
