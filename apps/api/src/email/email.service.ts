import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { EmailConfigService } from './email.config';
import { EmailProcessor } from './email.processor';
import { parseEmailOtpVerificationData, parseEmailVerifiedData } from './email.schemas';
import type { EmailJobPayload, EmailJobType } from './email.types';
import { EmailQueueService } from './email-queue.service';
import { EmailOtpVerificationData, EmailVerifiedData } from './templates';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly configService: EmailConfigService,
    private readonly queueService: EmailQueueService,
    private readonly processor: EmailProcessor,
  ) {
    if (!this.configService.runtime.smtpEnabled) {
      this.logger.warn(
        'SMTP is not fully configured. Email sending will be skipped unless localhost mode is active.',
      );
    }
  }

  async sendEmailVerifiedNotification(data: EmailVerifiedData): Promise<void> {
    const validatedData = parseEmailVerifiedData(data);
    this.validateRecipientDomain(validatedData.toEmail);

    const payload: EmailJobPayload = {
      type: 'email_verified',
      data: validatedData,
      idempotencyKey: this.createIdempotencyKey('email_verified', validatedData.toEmail),
      meta: {
        source: 'auth.emailVerified',
      },
    };

    try {
      await this.dispatch(payload);
    } catch (error) {
      this.logger.warn('Failed to dispatch email verified notification', {
        templateType: payload.type,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  async sendOtpVerificationEmail(data: EmailOtpVerificationData): Promise<void> {
    const validatedData = parseEmailOtpVerificationData(data);
    this.validateRecipientDomain(validatedData.toEmail);

    const payload: EmailJobPayload = {
      type: 'email_otp_verification',
      data: validatedData,
      idempotencyKey: this.createIdempotencyKey('email_otp_verification', validatedData.toEmail),
      meta: {
        source: 'auth.emailOtpVerification',
      },
    };

    try {
      await this.dispatch(payload);
    } catch (error) {
      this.logger.warn('Failed to dispatch OTP verification email', {
        templateType: payload.type,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  private async dispatch(payload: EmailJobPayload): Promise<void> {
    if (!this.configService.runtime.smtpEnabled) {
      if (this.configService.runtime.isLocalhost) {
        this.logger.log('Skipping email send in localhost mode', {
          templateType: payload.type,
        });
        return;
      }
      throw new Error('SMTP is not configured.');
    }

    if (this.queueService.isEnabled()) {
      await this.queueService.enqueue(payload);
      return;
    }

    if (!this.configService.runtime.isProductionLike) {
      this.logger.warn('Queue delivery disabled; using direct fallback delivery for non-production env.');
      await this.processor.processPayload(payload, {
        jobId: payload.idempotencyKey,
        attemptsMade: 0,
      });
      return;
    }

    throw new Error('Email queue is unavailable in production-like environment.');
  }

  private validateRecipientDomain(email: string): void {
    if (this.configService.runtime.isProductionLike) {
      return;
    }

    const domain = email.split('@')[1]?.toLowerCase();
    if (!domain) {
      throw new Error('Recipient domain is invalid.');
    }

    const blocked = this.configService.runtime.blockedDomains;
    const allowed = this.configService.runtime.allowedDomains;

    if (blocked.includes(domain)) {
      throw new Error('Recipient domain is blocked in this environment.');
    }

    if (allowed.length > 0 && !allowed.includes(domain)) {
      throw new Error('Recipient domain is not in the allowlist for this environment.');
    }
  }

  private createIdempotencyKey(type: EmailJobType, toEmail: string): string {
    return `${type}:${toEmail.toLowerCase()}:${Date.now()}:${randomUUID()}`;
  }
}
