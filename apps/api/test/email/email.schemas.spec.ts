import {
  parseEmailJobPayload,
  parseEmailOtpVerificationData,
  parseEmailVerifiedData,
} from '../../src/email/email.schemas';

describe('email schemas', () => {
  it('parses valid verified notification data', () => {
    const parsed = parseEmailVerifiedData({
      toEmail: 'user@example.com',
      toName: 'user',
    });

    expect(parsed.toEmail).toBe('user@example.com');
  });

  it('rejects invalid job payload', () => {
    expect(() =>
      parseEmailJobPayload({
        type: 'email_verified',
        data: {
          toEmail: 'not-an-email',
          toName: 'user',
        },
        idempotencyKey: 'id-1',
      }),
    ).toThrow('Invalid email address');
  });

  it('parses valid OTP verification data', () => {
    const parsed = parseEmailOtpVerificationData({
      toEmail: 'user@example.com',
      toName: 'user',
      code: '123456',
      expiresInMinutes: 10,
    });

    expect(parsed.code).toBe('123456');
  });

  it('parses valid OTP job payload', () => {
    const parsed = parseEmailJobPayload({
      type: 'email_otp_verification',
      data: {
        toEmail: 'user@example.com',
        toName: 'user',
        code: '123456',
        expiresInMinutes: 10,
      },
      idempotencyKey: 'id-otp-1',
    });

    expect(parsed.type).toBe('email_otp_verification');
  });
});
