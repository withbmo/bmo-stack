import { UnrecoverableError } from 'bullmq';

import { EmailProcessor } from '../../src/email/email.processor';
import { EmailTransportError } from '../../src/email/email.types';

describe('EmailProcessor', () => {
  it('processes email-verified payload successfully', async () => {
    const renderer = {
      renderEmailVerified: jest.fn().mockResolvedValue({
        subject: 'Email Verified Successfully',
        html: '<p>verified</p>',
        text: 'verified',
      }),
    } as any;

    const transport = {
      send: jest.fn().mockResolvedValue({ messageId: 'id-1' }),
    } as any;

    const processor = new EmailProcessor(renderer, transport);

    await processor.processPayload(
      {
        type: 'email_verified',
        data: {
          toEmail: 'user@example.com',
          toName: 'user',
        },
        idempotencyKey: 'email_verified:key',
      },
      { jobId: 'job-1', attemptsMade: 0 },
    );

    expect(renderer.renderEmailVerified).toHaveBeenCalled();
    expect(transport.send).toHaveBeenCalled();
  });

  it('throws UnrecoverableError for permanent failures', async () => {
    const renderer = {
      renderEmailVerified: jest.fn().mockResolvedValue({
        subject: 'Email Verified Successfully',
        html: '<p>verified</p>',
        text: 'verified',
      }),
    } as any;

    const transport = {
      send: jest
        .fn()
        .mockRejectedValue(new EmailTransportError('invalid recipient', 'permanent')),
    } as any;

    const processor = new EmailProcessor(renderer, transport);

    await expect(
      processor.processPayload({
        type: 'email_verified',
        data: {
          toEmail: 'user@example.com',
          toName: 'user',
        },
        idempotencyKey: 'email_verified:key',
      }),
    ).rejects.toBeInstanceOf(UnrecoverableError);
  });

  it('rethrows transient failures', async () => {
    const renderer = {
      renderEmailVerified: jest.fn().mockResolvedValue({
        subject: 'Email Verified Successfully',
        html: '<p>verified</p>',
        text: 'verified',
      }),
    } as any;

    const transport = {
      send: jest.fn().mockRejectedValue(new EmailTransportError('timeout', 'transient')),
    } as any;

    const processor = new EmailProcessor(renderer, transport);

    await expect(
      processor.processPayload({
        type: 'email_verified',
        data: {
          toEmail: 'user@example.com',
          toName: 'user',
        },
        idempotencyKey: 'email_verified:key',
      }),
    ).rejects.toBeInstanceOf(EmailTransportError);
  });

  it('treats schema validation errors as permanent', async () => {
    const renderer = {
      renderEmailVerified: jest.fn(),
    } as any;

    const transport = {
      send: jest.fn(),
    } as any;

    const processor = new EmailProcessor(renderer, transport);

    await expect(
      processor.processPayload({
        type: 'email_verified',
        data: {
          toEmail: 'user@example.com',
          toName: '',
        },
        idempotencyKey: 'email_verified:key',
      }),
    ).rejects.toBeInstanceOf(UnrecoverableError);
  });

  it('processes OTP verification payload successfully', async () => {
    const renderer = {
      renderEmailVerified: jest.fn(),
      renderEmailOtpVerification: jest.fn().mockResolvedValue({
        subject: 'Your Pytholit verification code',
        html: '<p>otp</p>',
        text: 'otp',
      }),
    } as any;

    const transport = {
      send: jest.fn().mockResolvedValue({ messageId: 'id-otp-1' }),
    } as any;

    const processor = new EmailProcessor(renderer, transport);

    await processor.processPayload({
      type: 'email_otp_verification',
      data: {
        toEmail: 'user@example.com',
        toName: 'user',
        code: '123456',
        expiresInMinutes: 10,
      },
      idempotencyKey: 'email_otp_verification:key',
    });

    expect(renderer.renderEmailOtpVerification).toHaveBeenCalled();
    expect(transport.send).toHaveBeenCalled();
  });
});
