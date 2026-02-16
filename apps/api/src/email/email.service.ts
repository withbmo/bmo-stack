import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendMailClient } from 'zeptomail';

import {
  EmailVerifiedData,
  getEmailVerifiedTemplate,
  getOtpEmailTemplate,
  OtpEmailData,
} from './templates';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly fromEmail: string;
  private readonly fromName: string;
  private readonly enabled: boolean;
  private readonly client?: SendMailClient;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('ZEPTOMAIL_API_KEY') || '';
    this.baseUrl =
      this.configService.get<string>('ZEPTOMAIL_BASE_URL') ||
      'https://api.zeptomail.com';
    this.fromEmail =
      this.configService.get<string>('ZEPTOMAIL_FROM_EMAIL') ||
      'noreply@pytholit.dev';
    this.fromName =
      this.configService.get<string>('ZEPTOMAIL_FROM_NAME') || 'Pytholit';
    this.enabled = this.apiKey.length > 0;

    if (this.enabled) {
      this.client = new SendMailClient({ url: this.baseUrl, token: this.apiKey });
    }

    if (!this.enabled) {
      this.logger.warn(
        'ZeptoMail API key not configured. Email sending will be logged to console only.',
      );
    }
  }

  /**
   * Validate email parameters before sending
   */
  private validateEmailParams(
    toEmail: string,
    subject: string,
    htmlBody: string,
    _textBody: string,
  ): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(toEmail)) {
      throw new Error(`Invalid email address: ${toEmail}`);
    }

    if (!subject || subject.trim().length === 0) {
      throw new Error('Email subject cannot be empty');
    }

    if (!htmlBody || htmlBody.trim().length === 0) {
      throw new Error('Email body cannot be empty');
    }
  }

  /**
   * Check if an error is permanent (don't retry) or transient (can retry)
   */
  private isPermanentError(error: any): boolean {
    // Classify errors from ZeptoMail SDK
    const permanentCodes = [
      'invalid_email',
      'auth_failed',
      'forbidden',
      'invalid_request',
    ];
    const permanentMessages = [
      'invalid email',
      'unauthorized',
      'forbidden',
      'bad request',
    ];

    if (error.code && permanentCodes.includes(error.code)) {
      return true;
    }

    if (error.message) {
      const lowerMessage = error.message.toLowerCase();
      return permanentMessages.some((msg) => lowerMessage.includes(msg));
    }

    return false;
  }

  /**
   * Retry an operation with exponential backoff
   */
  private async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries = 3,
    baseDelay = 1000,
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const startTime = Date.now();
        const result = await operation();
        const duration = Date.now() - startTime;

        this.logger.log('Email operation successful', {
          attempt,
          duration,
          timestamp: new Date().toISOString(),
        });

        return result;
      } catch (error) {
        lastError = error;

        // Enhanced logging
        this.logger.error('Email operation failed', {
          attempt,
          maxRetries,
          error: error.message,
          stack: error.stack,
          isPermanent: this.isPermanentError(error),
          timestamp: new Date().toISOString(),
        });

        // Don't retry on permanent errors
        if (this.isPermanentError(error)) {
          throw error;
        }

        // Retry with exponential backoff
        if (attempt < maxRetries) {
          const delay = baseDelay * Math.pow(2, attempt - 1);
          this.logger.warn(
            `Retrying in ${delay}ms (attempt ${attempt}/${maxRetries})`,
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    // All retries exhausted
    this.logger.error('All retry attempts exhausted', {
      maxRetries,
      finalError: lastError?.message || 'Unknown error',
    });
    throw lastError || new Error('All retry attempts failed');
  }

  /**
   * Send an email via ZeptoMail API
   */
  private async sendEmail(
    toEmail: string,
    toName: string,
    subject: string,
    htmlBody: string,
    textBody: string,
    trackOpens = true,
    trackClicks = false,
  ): Promise<void> {
    // Validate inputs
    this.validateEmailParams(toEmail, subject, htmlBody, textBody);

    // Development mode
    if (!this.enabled) {
      this.logger.log(
        `[DEV MODE] Email would be sent to: ${toEmail}\nSubject: ${subject}\n`,
      );
      return;
    }

    // Prepare payload
    const payload = {
      from: { address: this.fromEmail, name: this.fromName },
      to: [{ email_address: { address: toEmail, name: toName } }],
      subject,
      htmlbody: htmlBody,
      textbody: textBody,
      track_opens: trackOpens,
      track_clicks: trackClicks,
    };

    // Send with retry logic
    await this.retryWithBackoff(async () => {
      if (!this.client) {
        throw new Error('Email client not initialized');
      }
      const response = await this.client.sendMail(payload);
      this.logger.log('Email sent successfully', {
        to: toEmail,
        subject,
        messageId: response.message,
      });
    });
  }

  /**
   * Send OTP verification email
   */
  async sendOtpEmail(data: OtpEmailData): Promise<void> {
    try {
      const { subject, htmlBody, textBody } = getOtpEmailTemplate(data);

      await this.sendEmail(
        data.toEmail,
        data.toName,
        subject,
        htmlBody,
        textBody,
        true,
        false,
      );

      this.logger.log('OTP email sent successfully', {
        email: data.toEmail,
        purpose: data.purpose,
      });
    } catch (error) {
      this.logger.error('Failed to send OTP email', {
        email: data.toEmail,
        purpose: data.purpose,
        error: error.message,
        stack: error.stack,
      });
      throw new Error(
        `Failed to send verification email. Please try again or contact support.`,
      );
    }
  }

  /**
   * Send email verification success notification
   */
  async sendEmailVerifiedNotification(
    data: EmailVerifiedData,
  ): Promise<void> {
    try {
      const { subject, htmlBody, textBody } = getEmailVerifiedTemplate(data);

      await this.sendEmail(
        data.toEmail,
        data.toName,
        subject,
        htmlBody,
        textBody,
        true,
        false,
      );

      this.logger.log('Email verified notification sent', {
        email: data.toEmail,
      });
    } catch (error) {
      // Non-critical notification - log but don't throw
      this.logger.warn('Failed to send email verified notification', {
        email: data.toEmail,
        error: error.message,
      });
    }
  }
}
