import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { SmtpPermanentErrorCode } from './email.constants';
import { EmailConfigService } from './email.config';
import {
  EmailMessage,
  EmailSendResult,
  EmailTransport,
  EmailTransportError,
  EmailTransportErrorKind,
} from './email.types';

const PERMANENT_ERROR_CODES = new Set<string>(Object.values(SmtpPermanentErrorCode));

@Injectable()
export class SmtpEmailTransport implements EmailTransport {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: EmailConfigService,
  ) {}

  async send(message: EmailMessage): Promise<EmailSendResult> {
    try {
      const result = await this.mailerService.sendMail({
        from: {
          address: this.configService.runtime.fromAddress,
          name: this.configService.runtime.fromName,
        },
        to: {
          address: message.toEmail,
          name: message.toName,
        },
        subject: message.subject,
        html: message.html,
        text: message.text,
      });

      return {
        messageId:
          typeof result?.messageId === 'string' && result.messageId.length > 0
            ? result.messageId
            : undefined,
      };
    } catch (error) {
      const kind = this.classifyError(error);
      const messageText =
        error instanceof Error ? error.message : 'SMTP transport failed with unknown error';
      throw new EmailTransportError(messageText, kind, error);
    }
  }

  private classifyError(error: unknown): EmailTransportErrorKind {
    if (!error || typeof error !== 'object') {
      return 'transient';
    }

    const err = error as { code?: string; message?: string; responseCode?: number };

    if (typeof err.code === 'string' && PERMANENT_ERROR_CODES.has(err.code)) {
      return 'permanent';
    }

    if (typeof err.responseCode === 'number' && err.responseCode >= 500) {
      return 'transient';
    }

    if (typeof err.responseCode === 'number' && err.responseCode >= 400) {
      return 'permanent';
    }

    if (typeof err.message === 'string') {
      const lower = err.message.toLowerCase();

      if (
        lower.includes('invalid') ||
        lower.includes('auth') ||
        lower.includes('forbidden') ||
        lower.includes('unauthorized') ||
        lower.includes('mailbox unavailable')
      ) {
        return 'permanent';
      }

      if (
        lower.includes('timeout') ||
        lower.includes('temporar') ||
        lower.includes('connection') ||
        lower.includes('econnreset')
      ) {
        return 'transient';
      }
    }

    return 'transient';
  }
}
