import { EmailService } from '../../src/email/email.service';

describe('EmailService', () => {
  const baseConfig = {
    runtime: {
      smtpEnabled: true,
      isLocalhost: false,
      isProductionLike: false,
      allowedDomains: [],
      blockedDomains: [],
    },
  } as any;

  it('enqueues email-verified payload', async () => {
    const queueService = {
      isEnabled: jest.fn().mockReturnValue(true),
      enqueue: jest.fn().mockResolvedValue(undefined),
    } as any;

    const processor = {
      processPayload: jest.fn(),
    } as any;

    const service = new EmailService(baseConfig, queueService, processor);

    await service.sendEmailVerifiedNotification({
      toEmail: 'user@example.com',
      toName: 'user',
    });

    expect(queueService.enqueue).toHaveBeenCalledTimes(1);
    const payload = queueService.enqueue.mock.calls[0][0];
    expect(payload.type).toBe('email_verified');
  });

  it('uses direct processor fallback when queue is disabled in non-production', async () => {
    const queueService = {
      isEnabled: jest.fn().mockReturnValue(false),
      enqueue: jest.fn(),
    } as any;

    const processor = {
      processPayload: jest.fn().mockResolvedValue(undefined),
    } as any;

    const service = new EmailService(baseConfig, queueService, processor);

    await service.sendEmailVerifiedNotification({
      toEmail: 'user@example.com',
      toName: 'user',
    });

    expect(processor.processPayload).toHaveBeenCalledTimes(1);
  });

  it('enqueues OTP verification payload', async () => {
    const queueService = {
      isEnabled: jest.fn().mockReturnValue(true),
      enqueue: jest.fn().mockResolvedValue(undefined),
    } as any;

    const processor = {
      processPayload: jest.fn(),
    } as any;

    const service = new EmailService(baseConfig, queueService, processor);

    await service.sendOtpVerificationEmail({
      toEmail: 'user@example.com',
      toName: 'user',
      code: '123456',
      expiresInMinutes: 10,
    });

    expect(queueService.enqueue).toHaveBeenCalledTimes(1);
    const payload = queueService.enqueue.mock.calls[0][0];
    expect(payload.type).toBe('email_otp_verification');
  });

  it('throws on invalid email validation and does not enqueue', async () => {
    const queueService = {
      isEnabled: jest.fn().mockReturnValue(true),
      enqueue: jest.fn(),
    } as any;

    const processor = {
      processPayload: jest.fn(),
    } as any;

    const service = new EmailService(baseConfig, queueService, processor);

    await expect(
      service.sendEmailVerifiedNotification({
        toEmail: 'invalid-email',
        toName: 'user',
      }),
    ).rejects.toThrow('Invalid email address');
    expect(queueService.enqueue).not.toHaveBeenCalled();
  });

  it('throws on allowlist violations and does not enqueue', async () => {
    const config = {
      runtime: {
        ...baseConfig.runtime,
        allowedDomains: ['internal.dev'],
      },
    } as any;

    const queueService = {
      isEnabled: jest.fn().mockReturnValue(true),
      enqueue: jest.fn(),
    } as any;

    const processor = {
      processPayload: jest.fn(),
    } as any;

    const service = new EmailService(config, queueService, processor);

    await expect(
      service.sendEmailVerifiedNotification({
        toEmail: 'user@gmail.com',
        toName: 'user',
      }),
    ).rejects.toThrow('Recipient domain is not in the allowlist for this environment.');
    expect(queueService.enqueue).not.toHaveBeenCalled();
  });
});
