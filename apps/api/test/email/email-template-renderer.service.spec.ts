import { EmailTemplateRendererService } from '../../src/email/email-template-renderer.service';

jest.mock('@react-email/render', () => ({
  render: jest.fn(async () => '<html><body>rendered html</body></html>'),
  toPlainText: jest.fn(() => 'rendered text'),
}));

describe('EmailTemplateRendererService', () => {
  const service = new EmailTemplateRendererService();

  it('renders email-verified template', async () => {
    const rendered = await service.renderEmailVerified({
      toEmail: 'user@example.com',
      toName: 'user',
    });

    expect(rendered.subject).toBe('Email Verified Successfully');
    expect(rendered.html).toContain('rendered html');
    expect(rendered.text).toContain('rendered text');
  });

  it('renders email OTP verification template', async () => {
    const rendered = await service.renderEmailOtpVerification({
      toEmail: 'user@example.com',
      toName: 'user',
      code: '123456',
      expiresInMinutes: 10,
    });

    expect(rendered.subject).toBe('Your Pytholit verification code');
    expect(rendered.html).toContain('rendered html');
    expect(rendered.text).toContain('rendered text');
  });
});
