import { Reflector } from '@nestjs/core';

jest.mock('@thallesp/nestjs-better-auth', () => ({
  AuthService: class MockBetterAuthService {},
}));

import { BetterAuthGuard } from '../../src/auth/guards/better-auth.guard';

describe('BetterAuthGuard account-linking simulations', () => {
  const makeGuard = () => {
    const reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as Reflector;

    const betterAuthService = {
      instance: {
        api: {
          getSession: jest.fn(),
        },
      },
    } as any;

    const prisma = {
      client: {
        user: {
          findUnique: jest.fn(),
          update: jest.fn(),
          create: jest.fn(),
        },
      },
    } as any;

    const guard = new BetterAuthGuard(reflector, betterAuthService, prisma);
    return { guard, prisma };
  };

  it('marks existing by-id user as verified when OAuth session is verified', async () => {
    const { guard, prisma } = makeGuard();

    prisma.client.user.findUnique.mockResolvedValueOnce({
      id: 'u1',
      email: 'user@example.com',
      username: 'user',
      firstName: 'User',
      lastName: null,
      isEmailVerified: false,
      isActive: true,
    });
    prisma.client.user.update.mockResolvedValueOnce({
      id: 'u1',
      email: 'user@example.com',
      username: 'user',
      firstName: 'User',
      lastName: null,
      isEmailVerified: true,
      isActive: true,
    });

    const result = await (guard as any).resolveOrProvisionUser({
      id: 'u1',
      email: 'user@example.com',
      name: 'User',
      emailVerified: true,
    });

    expect(prisma.client.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'u1' },
        data: { isEmailVerified: true },
      }),
    );
    expect(result.isEmailVerified).toBe(true);
  });

  it('does not merge by email when OAuth session email is unverified', async () => {
    const { guard, prisma } = makeGuard();

    prisma.client.user.findUnique.mockResolvedValueOnce(null);

    const result = await (guard as any).resolveOrProvisionUser({
      id: '',
      email: 'user@example.com',
      name: 'User',
      emailVerified: false,
    });

    expect(result).toBeNull();
    expect(prisma.client.user.findUnique).toHaveBeenCalledTimes(1);
  });

  it('resolves existing by-email user when session email is verified', async () => {
    const { guard, prisma } = makeGuard();

    prisma.client.user.findUnique
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({
        id: 'u2',
        email: 'merge@example.com',
        username: 'merge_user',
        firstName: 'Merge',
        lastName: null,
        isEmailVerified: true,
        isActive: true,
      });

    const result = await (guard as any).resolveOrProvisionUser({
      id: 'oauth-id',
      email: 'merge@example.com',
      name: 'Merge User',
      emailVerified: true,
    });

    expect(result.id).toBe('u2');
    expect(prisma.client.user.findUnique).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ where: { email: 'merge@example.com' } }),
    );
  });
});
