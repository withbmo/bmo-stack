import type { EmailOtpVerificationData, EmailVerifiedData } from './templates';

export type EmailJobType = 'email_verified' | 'email_otp_verification';

export interface EmailJobMeta {
  source?: string;
  requestId?: string;
  userId?: string;
}

export interface EmailVerifiedJobPayload {
  type: 'email_verified';
  data: EmailVerifiedData;
  idempotencyKey: string;
  meta?: EmailJobMeta;
}

export interface EmailOtpVerificationJobPayload {
  type: 'email_otp_verification';
  data: EmailOtpVerificationData;
  idempotencyKey: string;
  meta?: EmailJobMeta;
}

export type EmailJobPayload = EmailVerifiedJobPayload | EmailOtpVerificationJobPayload;

export interface RenderedEmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailMessage {
  toEmail: string;
  toName: string;
  subject: string;
  html: string;
  text: string;
}

export interface EmailSendResult {
  messageId?: string;
}

export type EmailTransportErrorKind = 'transient' | 'permanent';

export class EmailTransportError extends Error {
  constructor(
    message: string,
    readonly kind: EmailTransportErrorKind,
    readonly causeError?: unknown,
  ) {
    super(message);
    this.name = 'EmailTransportError';
  }
}

export interface EmailTransport {
  send(message: EmailMessage): Promise<EmailSendResult>;
}

export interface EmailTemplateRenderer {
  renderEmailVerified(data: EmailVerifiedData): Promise<RenderedEmailTemplate>;
  renderEmailOtpVerification(data: EmailOtpVerificationData): Promise<RenderedEmailTemplate>;
}
