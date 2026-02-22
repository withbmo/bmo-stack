import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import request from 'supertest';

jest.mock('@thallesp/nestjs-better-auth', () => ({
  AuthService: class MockBetterAuthService {},
}));
jest.mock('../../src/auth/decorators/public.decorator', () => ({
  Public: () => () => undefined,
}));

import { AuthController } from '../../src/auth/auth.controller';
import { AuthFlowService } from '../../src/auth/auth-flow.service';

describe('Auth HTTP integration (supertest)', () => {
  const authFlowService = {
    signupPassword: jest.fn(),
    loginPassword: jest.fn(),
    sendOtp: jest.fn(),
    verifyOtp: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
  } as unknown as AuthFlowService;

  const configService = {
    get: jest.fn((key: string) => {
      if (key === 'GOOGLE_CLIENT_ID') return 'google-id';
      if (key === 'GOOGLE_CLIENT_SECRET') return 'google-secret';
      if (key === 'GITHUB_CLIENT_ID') return 'github-id';
      if (key === 'GITHUB_CLIENT_SECRET') return 'github-secret';
      return '';
    }),
  } as unknown as ConfigService;

  let app: any;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthFlowService, useValue: authFlowService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('POST /api/v1/auth-flow/signup-password -> otp_required', async () => {
    (authFlowService.signupPassword as jest.Mock).mockResolvedValue({
      status: 'otp_required',
      otpExpiresAt: '2026-02-22T12:00:00.000Z',
      nextRequestAt: '2026-02-22T11:51:00.000Z',
    });

    const res = await request(app.getHttpServer())
      .post('/api/v1/auth-flow/signup-password')
      .send({
        email: 'user@example.com',
        username: 'user_1',
        firstName: 'User',
        lastName: 'One',
        password: 'StrongPassword!123',
        captchaToken: 'token',
      })
      .expect(201);

    expect(res.body).toEqual({
      status: 'otp_required',
      otpExpiresAt: '2026-02-22T12:00:00.000Z',
      nextRequestAt: '2026-02-22T11:51:00.000Z',
    });
    expect(authFlowService.signupPassword).toHaveBeenCalled();
  });

  it('POST /api/v1/auth-flow/login-password -> authenticated + Set-Cookie forwarded', async () => {
    (authFlowService.loginPassword as jest.Mock).mockResolvedValue({
      status: 'authenticated',
      setCookies: ['sid=abc; Path=/; HttpOnly'],
    });

    const res = await request(app.getHttpServer())
      .post('/api/v1/auth-flow/login-password')
      .send({
        email: 'verified@example.com',
        password: 'StrongPassword!123',
        captchaToken: 'token',
      })
      .expect(201);

    expect(res.body).toEqual({ status: 'authenticated' });
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.headers['set-cookie'][0]).toContain('sid=abc');
  });

  it('POST /api/v1/auth-flow/otp/send -> sent', async () => {
    (authFlowService.sendOtp as jest.Mock).mockResolvedValue({
      status: 'sent',
      otpExpiresAt: '2026-02-22T12:00:00.000Z',
      nextRequestAt: '2026-02-22T11:51:00.000Z',
    });

    const res = await request(app.getHttpServer())
      .post('/api/v1/auth-flow/otp/send')
      .send({
        email: 'user@example.com',
        purpose: 'email_verification',
        captchaToken: 'token',
      })
      .expect(201);

    expect(res.body.status).toBe('sent');
    expect(authFlowService.sendOtp).toHaveBeenCalled();
  });

  it('POST /api/v1/auth-flow/otp/verify -> authenticated + Set-Cookie forwarded', async () => {
    (authFlowService.verifyOtp as jest.Mock).mockResolvedValue({
      status: 'authenticated',
      setCookies: ['sid=verified; Path=/; HttpOnly'],
    });

    const res = await request(app.getHttpServer())
      .post('/api/v1/auth-flow/otp/verify')
      .send({
        email: 'user@example.com',
        purpose: 'email_verification',
        code: '123456',
      })
      .expect(201);

    expect(res.body).toEqual({ status: 'authenticated' });
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.headers['set-cookie'][0]).toContain('sid=verified');
  });

  it('POST /api/v1/auth-flow/password/forgot -> wraps forgot flow', async () => {
    (authFlowService.forgotPassword as jest.Mock).mockResolvedValue({
      status: true,
      message: 'sent',
    });

    const res = await request(app.getHttpServer())
      .post('/api/v1/auth-flow/password/forgot')
      .send({
        email: 'user@example.com',
      })
      .expect(201);

    expect(res.body).toEqual({ status: true, message: 'sent' });
  });

  it('POST /api/v1/auth-flow/password/reset -> wraps reset flow', async () => {
    (authFlowService.resetPassword as jest.Mock).mockResolvedValue({
      status: true,
    });

    const res = await request(app.getHttpServer())
      .post('/api/v1/auth-flow/password/reset')
      .send({
        token: 'token',
        newPassword: 'StrongPassword!123',
      })
      .expect(201);

    expect(res.body).toEqual({ status: true });
  });

  it('POST /api/v1/auth-flow/otp/verify rejects invalid DTO input', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth-flow/otp/verify')
      .send({
        email: 'user@example.com',
        purpose: 'email_verification',
        code: '12ab',
      })
      .expect(400);

    expect(authFlowService.verifyOtp).not.toHaveBeenCalled();
  });

  it('GET /api/v1/auth-flow/providers only returns enabled providers', async () => {
    configService.get = jest.fn((key: string) => {
      if (key === 'GOOGLE_CLIENT_ID') return 'google-id';
      if (key === 'GOOGLE_CLIENT_SECRET') return '';
      if (key === 'GITHUB_CLIENT_ID') return 'github-id';
      if (key === 'GITHUB_CLIENT_SECRET') return 'github-secret';
      return '';
    });

    const res = await request(app.getHttpServer()).get('/api/v1/auth-flow/providers').expect(200);
    expect(res.body).toEqual({ providers: ['github'] });
  });
});
