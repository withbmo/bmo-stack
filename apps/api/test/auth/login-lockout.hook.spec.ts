import type { AuthHookContext } from '@thallesp/nestjs-better-auth';

import { LoginLockoutHook } from '../../src/auth/hooks/login-lockout.hook';
import { DistributedLockService } from '../../src/common/services/distributed-lock.service';

jest.mock('rate-limiter-flexible', () => {
  class MockRateLimiterRedis {
    public get = jest.fn().mockResolvedValue(null);
    public delete = jest.fn().mockResolvedValue(undefined);
    public consume = jest.fn().mockResolvedValue(undefined);
  }
  return {
    RateLimiterRedis: MockRateLimiterRedis,
  };
});

jest.mock('../../src/auth/hooks/auth-hook.utils', () => ({
  extractNormalizedEmail: jest.fn().mockReturnValue('user@example.com'),
}));

describe('LoginLockoutHook', () => {
  const makeHook = () => {
    const lockService = {
      client: jest.fn().mockReturnValue({}),
    } as unknown as DistributedLockService;

    const hook = new LoginLockoutHook(lockService);
    hook.onModuleInit();

    return hook as unknown as LoginLockoutHook & {
      limiter: {
        get: jest.Mock;
        delete: jest.Mock;
        consume: jest.Mock;
      };
    };
  };

  it('initializes a rate limiter on module init', () => {
    const hook = makeHook();

    expect(hook.limiter).toBeDefined();
    expect(typeof hook.limiter.get).toBe('function');
  });

  it('does nothing when there is no lock record', async () => {
    const hook = makeHook();
    const ctx = {} as AuthHookContext;

    await expect(hook.checkLock(ctx)).resolves.toBeUndefined();
    expect(hook.limiter.get).toHaveBeenCalledWith('user@example.com');
  });

  it('resets counters on successful login', async () => {
    const hook = makeHook();
    const ctx = { returned: { statusCode: 200 } } as unknown as AuthHookContext;

    await hook.trackResult(ctx);

    expect(hook.limiter.delete).toHaveBeenCalledWith('user@example.com');
  });

  it('consumes a point on failed login', async () => {
    const hook = makeHook();
    const ctx = { returned: { statusCode: 401 } } as unknown as AuthHookContext;

    await hook.trackResult(ctx);

    expect(hook.limiter.consume).toHaveBeenCalledWith('user@example.com');
  });
});
