import { Injectable, Logger } from '@nestjs/common';
import type { Job } from 'bullmq';
import { UnrecoverableError } from 'bullmq';
import * as crypto from 'crypto';

import {
  EmailMetric,
} from './email.constants';
import { isZodValidationError, parseEmailJobPayload } from './email.schemas';
import { SmtpEmailTransport } from './email.transport';
import { type EmailJobPayload,EmailTransportError, EmailTransportErrorKind } from './email.types';
import { EmailTemplateRendererService } from './email-template-renderer.service';

@Injectable()
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(
    private readonly renderer: EmailTemplateRendererService,
    private readonly transport: SmtpEmailTransport,
  ) {}

  async process(job: Job<EmailJobPayload>): Promise<void> {
    await this.processPayload(job.data, {
      jobId: job.id,
      attemptsMade: job.attemptsMade,
    });
  }

  async processPayload(
    payload: EmailJobPayload,
    context: { jobId?: string; attemptsMade?: number } = {},
  ): Promise<void> {
    const startedAt = Date.now();
    let templateType: EmailJobPayload['type'] | 'unknown' = 'unknown';

    try {
      const validatedPayload = parseEmailJobPayload(payload);
      templateType = validatedPayload.type;
      const { toEmail, toName, subject, html, text, templateType: builtTemplateType } =
        await this.buildMessage(
        validatedPayload,
      );
      const sendResult = await this.transport.send({ toEmail, toName, subject, html, text });

      this.recordMetric(EmailMetric.Success, { templateType: builtTemplateType });
      this.logger.log('Email sent', {
        jobId: context.jobId,
        templateType: builtTemplateType,
        recipientHash: this.hashEmail(toEmail),
        attempt: (context.attemptsMade ?? 0) + 1,
        durationMs: Date.now() - startedAt,
        messageId: sendResult.messageId,
      });
    } catch (error) {
      const kind = this.getErrorKind(error);

      if (kind === 'transient') {
        this.recordMetric(EmailMetric.Retry, { templateType });
      }

      this.recordMetric(EmailMetric.Failure, { templateType });
      this.logger.error('Email job failed', {
        jobId: context.jobId,
        templateType,
        attempt: (context.attemptsMade ?? 0) + 1,
        durationMs: Date.now() - startedAt,
        error: error instanceof Error ? error.message : 'Unknown error',
        kind,
      });

      if (kind === 'permanent') {
        throw new UnrecoverableError(error instanceof Error ? error.message : 'Permanent email failure');
      }

      throw error;
    }
  }

  private async buildMessage(payload: EmailJobPayload): Promise<{
    toEmail: string;
    toName: string;
    subject: string;
    html: string;
    text: string;
    templateType: EmailJobPayload['type'];
  }> {
    if (payload.type === 'email_verified') {
      const rendered = await this.renderer.renderEmailVerified(payload.data);
      return {
        toEmail: payload.data.toEmail,
        toName: payload.data.toName,
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
        templateType: payload.type,
      };
    }

    const rendered = await this.renderer.renderEmailOtpVerification(payload.data);
    return {
      toEmail: payload.data.toEmail,
      toName: payload.data.toName,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
      templateType: payload.type,
    };
  }

  private getErrorKind(error: unknown): EmailTransportErrorKind {
    if (error instanceof EmailTransportError) {
      return error.kind;
    }
    if (isZodValidationError(error)) {
      return 'permanent';
    }
    return 'transient';
  }

  private hashEmail(email: string): string {
    return crypto.createHash('sha256').update(email.toLowerCase()).digest('hex').slice(0, 12);
  }

  private recordMetric(name: string, tags: Record<string, string>): void {
    this.logger.debug({ metric: name, ...tags });
  }
}
