import { BadRequestException, UnauthorizedException } from '@nestjs/common';
jest.mock('@thallesp/nestjs-better-auth', () => ({
  AuthService: class MockBetterAuthService {},
}));

import { AuthFlowService } from '../../src/auth/auth-flow.service';

describe('AuthFlowService simulations', () => {
  const makeService = () => {
    const configService = {
      get: jest.fn((key: string) => {
        if (key === 'NODE_ENV') return 'development';
        if (key === 'JWT_SECRET') return 'test-secret';
        return '';
      }),
    } as any;

    const prisma = {
      client: {
        user: {
          findUnique: jest.fn(),
          update: jest.fn(),
          create: jest.fn(),
          updateMany: jest.fn(),
        },
        $queryRawUnsafe: jest.fn(),
        $executeRawUnsafe: jest.fn(),
      },
    } as any;

    const turnstile = {
      verifyToken: jest.fn().mockResolvedValue(true),
    } as any;

    const emailService = {
      sendOtpVerificationEmail: jest.fn().mockResolvedValue(undefined),
    } as any;

    const betterAuthService = {
      instance: {
        api: {
          signUpEmail: jest.fn(),
          signInEmail: jest.fn(),
          createVerificationOTP: jest.fn(),
          verifyEmailOTP: jest.fn(),
          requestPasswordReset: jest.fn(),
          resetPassword: jest.fn(),
        },
      },
    } as any;

    const service = new AuthFlowService(
      configService,
      prisma,
      turnstile,
      emailService,
      betterAuthService,
    );

    return { service, configService, prisma, turnstile, emailService, betterAuthService };
  };

  const createHeaders = () => new Headers({ cookie: 'a=b' });

  it('signup-password returns otp_required and sends OTP email', async () => {
    const { service, prisma, betterAuthService, emailService } = makeService();

    prisma.client.user.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
    prisma.client.user.create.mockResolvedValueOnce({ id: 'u1' });

    prisma.client.$queryRawUnsafe.mockImplementation(async (sql: string) => {
      if (sql.includes('FROM "auth_otp_throttles"')) return [];
      if (sql.includes('INSERT INTO "auth_otp_throttles"')) return [{ attempts: 1 }];
      return [];
    });

    betterAuthService.instance.api.signUpEmail.mockResolvedValue({ token: null, user: { id: 'u1' } });
    betterAuthService.instance.api.createVerificationOTP.mockResolvedValue('123456');

    const result = await service.signupPassword(
      {
        email: 'test@example.com',
        username: 'test_user',
        firstName: 'Test',
        lastName: 'User',
        password: 'VeryStrongPassword!123',
        captchaToken: 'token',
      },
      createHeaders(),
      '127.0.0.1',
      'jest-agent',
    );

    expect(result.status).toBe('otp_required');
    expect(emailService.sendOtpVerificationEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        toEmail: 'test@example.com',
        code: '123456',
        expiresInMinutes: 10,
      }),
    );
  });

  it('login-password returns authenticated and forwards cookie when user is verified', async () => {
    const { service, betterAuthService } = makeService();

    const response = new Response(JSON.stringify({ ok: true }), {
      headers: { 'set-cookie': 'sid=abc; Path=/; HttpOnly' },
    });
    betterAuthService.instance.api.signInEmail.mockResolvedValue(response);

    const result = await service.loginPassword(
      {
        email: 'verified@example.com',
        password: 'StrongPassword!123',
        captchaToken: 'token',
      },
      createHeaders(),
      '127.0.0.1',
      'jest-agent',
    );

    expect(result).toEqual({
      status: 'authenticated',
      setCookies: ['sid=abc; Path=/; HttpOnly'],
    });
  });

  it('login-password returns otp_required for unverified users', async () => {
    const { service, prisma, betterAuthService, emailService } = makeService();

    betterAuthService.instance.api.signInEmail.mockRejectedValue({
      status: 403,
      detail: 'please verify your email',
    });
    betterAuthService.instance.api.createVerificationOTP.mockResolvedValue('654321');

    prisma.client.$queryRawUnsafe.mockImplementation(async (sql: string) => {
      if (sql.includes('FROM "auth_otp_throttles"')) return [];
      if (sql.includes('INSERT INTO "auth_otp_throttles"')) return [{ attempts: 1 }];
      return [];
    });

    const result = await service.loginPassword(
      {
        email: 'unverified@example.com',
        password: 'StrongPassword!123',
        captchaToken: 'token',
      },
      createHeaders(),
      '127.0.0.1',
      'jest-agent',
    );

    expect(result.status).toBe('otp_required');
    expect(emailService.sendOtpVerificationEmail).toHaveBeenCalled();
  });

  it('sendOtp enforces cooldown', async () => {
    const { service, prisma } = makeService();

    prisma.client.$queryRawUnsafe.mockImplementation(async (sql: string) => {
      if (sql.includes('FROM "auth_otp_throttles"')) return [];
      if (sql.includes('send_cooldown')) return [{ attempts: 2 }];
      if (sql.includes('INSERT INTO "auth_otp_throttles"')) return [{ attempts: 1 }];
      return [];
    });

    await expect(
      service.sendOtp(
        {
          email: 'cooldown@example.com',
          purpose: 'email_verification',
          captchaToken: 'token',
        },
        createHeaders(),
        '127.0.0.1',
        'jest-agent',
      ),
    ).rejects.toMatchObject({
      response: expect.objectContaining({ code: 'AUTH_OTP_COOLDOWN' }),
    });
  });

  it('sendOtp locks when hourly throttle exceeds max attempts', async () => {
    const { service, prisma } = makeService();

    prisma.client.$queryRawUnsafe.mockImplementation(async (sql: string) => {
      if (sql.includes('FROM "auth_otp_throttles"')) return [];
      if (sql.includes('INSERT INTO "auth_otp_throttles"')) return [{ attempts: 6 }];
      return [];
    });

    await expect(
      service.sendOtp(
        {
          email: 'locked@example.com',
          purpose: 'email_verification',
          captchaToken: 'token',
        },
        createHeaders(),
        '127.0.0.1',
        'jest-agent',
      ),
    ).rejects.toMatchObject({
      response: expect.objectContaining({ code: 'AUTH_OTP_LOCKED' }),
    });

    expect(prisma.client.$executeRawUnsafe).toHaveBeenCalled();
  });

  it('verifyOtp rejects invalid code', async () => {
    const { service, prisma, betterAuthService } = makeService();

    prisma.client.$queryRawUnsafe.mockImplementation(async (sql: string) => {
      if (sql.includes('FROM "auth_otp_throttles"')) return [];
      if (sql.includes('INSERT INTO "auth_otp_throttles"')) return [{ attempts: 1 }];
      return [];
    });
    betterAuthService.instance.api.verifyEmailOTP.mockRejectedValue({
      status: 401,
      detail: 'invalid otp',
    });

    await expect(
      service.verifyOtp(
        {
          email: 'user@example.com',
          purpose: 'email_verification',
          code: '123456',
        },
        createHeaders(),
        '127.0.0.1',
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('verifyOtp authenticates on valid code and returns Set-Cookie', async () => {
    const { service, prisma, betterAuthService } = makeService();

    prisma.client.$queryRawUnsafe.mockImplementation(async (sql: string) => {
      if (sql.includes('FROM "auth_otp_throttles"')) return [];
      if (sql.includes('INSERT INTO "auth_otp_throttles"')) return [{ attempts: 1 }];
      return [];
    });

    const response = new Response(JSON.stringify({ ok: true }), {
      headers: { 'set-cookie': 'sid=verified; Path=/; HttpOnly' },
    });
    betterAuthService.instance.api.verifyEmailOTP.mockResolvedValue(response);

    const result = await service.verifyOtp(
      {
        email: 'user@example.com',
        purpose: 'email_verification',
        code: '123456',
      },
      createHeaders(),
      '127.0.0.1',
    );

    expect(result).toEqual({
      status: 'authenticated',
      setCookies: ['sid=verified; Path=/; HttpOnly'],
    });
    expect(prisma.client.user.updateMany).toHaveBeenCalledWith({
      where: { email: 'user@example.com' },
      data: { isEmailVerified: true },
    });
  });

  it('wraps forgot-password and reset-password against Better Auth APIs', async () => {
    const { service, betterAuthService } = makeService();

    betterAuthService.instance.api.requestPasswordReset.mockResolvedValue({
      status: true,
      message: 'sent',
    });
    betterAuthService.instance.api.resetPassword.mockResolvedValue({ status: true });

    await expect(
      service.forgotPassword({ email: 'USER@example.com' }, createHeaders()),
    ).resolves.toEqual({ status: true, message: 'sent' });

    await expect(
      service.resetPassword({ token: 'token', newPassword: 'StrongPassword!123' }, createHeaders()),
    ).resolves.toEqual({ status: true });
  });

  it('rejects unsupported OTP purpose', async () => {
    const { service } = makeService();

    await expect(
      service.sendOtp(
        {
          email: 'user@example.com',
          purpose: 'email_verificationx' as any,
          captchaToken: 'token',
        },
        createHeaders(),
        '127.0.0.1',
        'jest-agent',
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
