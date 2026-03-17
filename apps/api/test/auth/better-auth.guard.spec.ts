import type { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

jest.mock('@thallesp/nestjs-better-auth', () => ({
  AuthService: class MockBetterAuthService {},
}));

import { BetterAuthGuard } from '../../src/auth/guards/better-auth.guard';

const makeContext = (req: any): ExecutionContext =>
  ({
    getHandler: () => ({}),
    getClass: () => ({}),
    switchToHttp: () => ({ getRequest: () => req }),
  }) as any;

const makeGuard = (opts?: { isPublic?: boolean; sessionResult?: any; throwError?: Error }) => {
  const reflector = {
    getAllAndOverride: jest.fn().mockReturnValue(opts?.isPublic ?? false),
  } as unknown as Reflector;

  const betterAuthService = {
    instance: {
      api: {
        getSession: opts?.throwError
          ? jest.fn().mockRejectedValue(opts.throwError)
          : jest.fn().mockResolvedValue(opts?.sessionResult ?? null),
      },
    },
  } as any;

  const guard = new BetterAuthGuard(reflector, betterAuthService);
  return { guard };
};

describe('BetterAuthGuard', () => {
  it('allows access on public route without session', async () => {
    const { guard } = makeGuard({ isPublic: true, sessionResult: null });
    const req = { headers: {} };
    await expect(guard.canActivate(makeContext(req))).resolves.toBe(true);
  });

  it('denies access on protected route without session', async () => {
    const { guard } = makeGuard({ isPublic: false, sessionResult: null });
    const req = { headers: {} };
    await expect(guard.canActivate(makeContext(req))).rejects.toHaveProperty(
      'response.code',
      'AUTH_UNAUTHENTICATED'
    );
  });

  it('blocks unverified email', async () => {
    const { guard } = makeGuard({
      isPublic: false,
      sessionResult: {
        user: { id: 'u1', email: 'user@example.com', emailVerified: false, isActive: true },
        session: {},
      },
    });
    const req = { headers: {} };
    await expect(guard.canActivate(makeContext(req))).rejects.toHaveProperty(
      'response.code',
      'AUTH_EMAIL_UNVERIFIED'
    );
  });

  it('blocks inactive accounts', async () => {
    const { guard } = makeGuard({
      isPublic: false,
      sessionResult: {
        user: { id: 'u1', email: 'user@example.com', emailVerified: true, isActive: false },
        session: {},
      },
    });
    const req = { headers: {} };
    await expect(guard.canActivate(makeContext(req))).rejects.toHaveProperty(
      'response.code',
      'AUTH_ACCOUNT_INACTIVE'
    );
  });

  it('populates request.user for verified active sessions', async () => {
    const { guard } = makeGuard({
      sessionResult: {
        user: {
          id: 'u1',
          email: 'user@example.com',
          emailVerified: true,
          isActive: true,
          username: 'user',
          firstName: 'User',
          lastName: null,
        },
        session: { id: 's1' },
      },
    });
    const req: any = { headers: {} };
    await expect(guard.canActivate(makeContext(req))).resolves.toBe(true);
    expect(req.user).toEqual(
      expect.objectContaining({
        id: 'u1',
        email: 'user@example.com',
        isEmailVerified: true,
        isActive: true,
      })
    );
  });

  it('allows public route when Better Auth throws', async () => {
    const { guard } = makeGuard({ isPublic: true, throwError: new Error('boom') });
    const req = { headers: {} };
    await expect(guard.canActivate(makeContext(req))).resolves.toBe(true);
  });
});
