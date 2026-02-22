import { Injectable } from '@nestjs/common';
import { render, toPlainText } from '@react-email/render';

import type { EmailTemplateRenderer, RenderedEmailTemplate } from './email.types';
import {
  EmailOtpVerificationData,
  EmailOtpVerificationTemplate,
  EmailVerifiedData,
  EmailVerifiedTemplate,
  getEmailOtpVerificationSubject,
  getEmailVerifiedSubject,
} from './templates';

@Injectable()
export class EmailTemplateRendererService implements EmailTemplateRenderer {
  async renderEmailVerified(data: EmailVerifiedData): Promise<RenderedEmailTemplate> {
    const subject = getEmailVerifiedSubject();
    const html = await render(EmailVerifiedTemplate(data));
    const text = toPlainText(html);

    return { subject, html, text };
  }

  async renderEmailOtpVerification(data: EmailOtpVerificationData): Promise<RenderedEmailTemplate> {
    const subject = getEmailOtpVerificationSubject();
    const html = await render(EmailOtpVerificationTemplate(data));
    const text = toPlainText(html);

    return { subject, html, text };
  }
}
