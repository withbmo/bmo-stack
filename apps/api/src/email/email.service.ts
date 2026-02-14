import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  getOtpEmailTemplate,
  getEmailVerifiedTemplate,
  OtpEmailData,
  EmailVerifiedData,
} from './templates';

interface ZeptoMailRecipient {
  email_address: {
    address: string;
    name: string;
  };
}

interface ZeptoMailRequest {
  from: {
    address: string;
    name: string;
  };
  to: ZeptoMailRecipient[];
  subject: string;
  htmlbody: string;
  textbody: string;
  track_opens?: boolean;
  track_clicks?: boolean;
}

interface ZeptoMailResponse {
  message_id?: string;
  data?: any;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly fromEmail: string;
  private readonly fromName: string;
  private readonly enabled: boolean;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.apiKey = this.configService.get<string>('ZEPTOMAIL_API_KEY') || '';
    this.baseUrl =
      this.configService.get<string>('ZEPTOMAIL_BASE_URL') ||
      'https://api.zeptomail.com';
    this.fromEmail =
      this.configService.get<string>('ZEPTOMAIL_FROM_EMAIL') ||
      'noreply@pytholit.com';
    this.fromName =
      this.configService.get<string>('ZEPTOMAIL_FROM_NAME') || 'Pytholit';
    this.enabled = !!this.apiKey;

    if (!this.enabled) {
      this.logger.warn(
        'ZeptoMail API key not configured. Email sending will be logged to console only.',
      );
    }
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
  ): Promise<ZeptoMailResponse> {
    if (!this.enabled) {
      this.logger.log(
        `[DEV MODE] Email would be sent to: ${toEmail}\nSubject: ${subject}\n`,
      );
      return { message_id: 'dev-mode-no-send' };
    }

    try {
      const payload: ZeptoMailRequest = {
        from: {
          address: this.fromEmail,
          name: this.fromName,
        },
        to: [
          {
            email_address: {
              address: toEmail,
              name: toName || '',
            },
          },
        ],
        subject,
        htmlbody: htmlBody,
        textbody: textBody,
        track_opens: trackOpens,
        track_clicks: trackClicks,
      };

      const response = await firstValueFrom(
        this.httpService.post<ZeptoMailResponse>(
          `${this.baseUrl}/v1.1/email`,
          payload,
          {
            headers: {
              Authorization: this.apiKey,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      this.logger.log(
        `Email sent successfully to ${toEmail} (Message ID: ${response.data.message_id})`,
      );

      return response.data;
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${toEmail}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
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

      this.logger.log(`OTP email sent to ${data.toEmail} for ${data.purpose}`);
    } catch (error) {
      this.logger.error(
        `Failed to send OTP email to ${data.toEmail}: ${error.message}`,
        {
          purpose: data.purpose,
          error: error.message,
        },
      );
      // Re-throw to let the caller handle it
      throw error;
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

      this.logger.log(`Email verified notification sent to ${data.toEmail}`);
    } catch (error) {
      this.logger.error(
        `Failed to send email verified notification to ${data.toEmail}: ${error.message}`,
        error.stack,
      );
      // Don't throw - verification notification is not critical
      // User already verified, email is just a courtesy
    }
  }
}
