import { z, ZodError } from 'zod';

import type {
  EmailJobPayload,
  EmailOtpVerificationJobPayload,
  EmailVerifiedJobPayload,
} from './email.types';

const emailAddressSchema = z
  .string()
  .trim()
  .email('Invalid email address')
  .max(320, 'Email address is too long');

const toNameSchema = z
  .string()
  .trim()
  .min(1, 'Recipient name is required')
  .max(120, 'Recipient name is too long');

export const emailVerifiedDataSchema = z.object({
  toEmail: emailAddressSchema,
  toName: toNameSchema,
});

export const emailOtpVerificationDataSchema = z.object({
  toEmail: emailAddressSchema,
  toName: toNameSchema,
  code: z.string().trim().regex(/^\d{6}$/, 'OTP code must be 6 digits'),
  expiresInMinutes: z.number().int().positive().max(60),
});

const emailJobMetaSchema = z
  .object({
    source: z.string().trim().min(1).max(64).optional(),
    requestId: z.string().trim().min(1).max(128).optional(),
    userId: z.string().trim().min(1).max(128).optional(),
  })
  .optional();

export const emailVerifiedJobPayloadSchema = z.object({
  type: z.literal('email_verified'),
  data: emailVerifiedDataSchema,
  idempotencyKey: z.string().trim().min(1).max(256),
  meta: emailJobMetaSchema,
});

export const emailOtpVerificationJobPayloadSchema = z.object({
  type: z.literal('email_otp_verification'),
  data: emailOtpVerificationDataSchema,
  idempotencyKey: z.string().trim().min(1).max(256),
  meta: emailJobMetaSchema,
});

export const emailJobPayloadSchema = z.union([
  emailVerifiedJobPayloadSchema,
  emailOtpVerificationJobPayloadSchema,
]);

export function parseEmailVerifiedData(input: unknown) {
  return emailVerifiedDataSchema.parse(input);
}

export function parseEmailOtpVerificationData(input: unknown) {
  return emailOtpVerificationDataSchema.parse(input);
}

export function parseEmailJobPayload(input: unknown): EmailJobPayload {
  return emailJobPayloadSchema.parse(input) as EmailJobPayload;
}

export function isZodValidationError(error: unknown): error is ZodError {
  return error instanceof ZodError;
}

export type ParsedEmailVerifiedJobPayload = z.infer<typeof emailVerifiedJobPayloadSchema> &
  EmailVerifiedJobPayload;

export type ParsedEmailOtpVerificationJobPayload = z.infer<
  typeof emailOtpVerificationJobPayloadSchema
> &
  EmailOtpVerificationJobPayload;
