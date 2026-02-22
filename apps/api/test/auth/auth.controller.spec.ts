import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

jest.mock('@thallesp/nestjs-better-auth', () => ({
  AuthService: class MockBetterAuthService {},
}));
jest.mock('../../src/auth/decorators/public.decorator', () => ({
  Public: () => () => undefined,
}));

import { AuthController } from '../../src/auth/auth.controller';
import { AuthFlowService } from '../../src/auth/auth-flow.service';

describe('AuthController', () => {
  const configService = {
    get: jest.fn().mockReturnValue('value'),
  } as any;

  const authFlowService = {
    loginPassword: jest.fn(),
    verifyOtp: jest.fn(),
  } as unknown as AuthFlowService;

  const makeReq = () =>
    ({
      headers: { cookie: 'a=b' },
      ip: '127.0.0.1',
      get: jest.fn().mockReturnValue('agent'),
    }) as any;

  const makeRes = () =>
    ({
      setHeader: jest.fn(),
    }) as any;

  let controller: AuthController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthFlowService, useValue: authFlowService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    controller = module.get(AuthController);
    jest.clearAllMocks();
  });

  it('forwards Set-Cookie from login-password response and strips setCookies field', async () => {
    (authFlowService.loginPassword as jest.Mock).mockResolvedValue({
      status: 'authenticated',
      setCookies: ['cookie-a=1; Path=/; HttpOnly'],
    });

    const req = makeReq();
    const res = makeRes();
    const payload = await controller.loginPassword({} as any, req, res);

    expect(res.setHeader).toHaveBeenCalledWith('Set-Cookie', ['cookie-a=1; Path=/; HttpOnly']);
    expect(payload).toEqual({ status: 'authenticated' });
  });

  it('forwards Set-Cookie from otp/verify response and strips setCookies field', async () => {
    (authFlowService.verifyOtp as jest.Mock).mockResolvedValue({
      status: 'authenticated',
      setCookies: ['cookie-b=1; Path=/; HttpOnly'],
    });

    const req = makeReq();
    const res = makeRes();
    const payload = await controller.verifyOtp({} as any, req, res);

    expect(res.setHeader).toHaveBeenCalledWith('Set-Cookie', ['cookie-b=1; Path=/; HttpOnly']);
    expect(payload).toEqual({ status: 'authenticated' });
  });

  it('hides OAuth providers when env credentials are missing', () => {
    configService.get = jest.fn((key: string) => {
      if (key === 'GOOGLE_CLIENT_ID') return 'google-id';
      if (key === 'GOOGLE_CLIENT_SECRET') return '';
      if (key === 'GITHUB_CLIENT_ID') return 'github-id';
      if (key === 'GITHUB_CLIENT_SECRET') return 'github-secret';
      return '';
    });

    const providers = controller.getProviders();
    expect(providers).toEqual({ providers: ['github'] });
  });
});
