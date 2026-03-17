import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AfterHook, type AuthHookContext, BeforeHook, Hook } from '@thallesp/nestjs-better-auth';
import { RateLimiterRedis, RateLimiterRes } from 'rate-limiter-flexible';

import { DistributedLockService } from '../../common/services/distributed-lock.service.js';
import { extractNormalizedEmail } from './auth-hook.utils.js';

const MAX_FAILED_ATTEMPTS = 5;
const WINDOW_SECONDS = 10 * 60; // 10 minutes
const LOCKOUT_SECONDS = 10 * 60; // 10 minutes

type ApiErrorLike = {
  statusCode?: number;
};

@Hook()
@Injectable()
export class LoginLockoutHook implements OnModuleInit {
  private readonly logger = new Logger(LoginLockoutHook.name);
  private limiter!: RateLimiterRedis;

  constructor(private readonly lockService: DistributedLockService) {}

  onModuleInit(): void {
    this.limiter = new RateLimiterRedis({
      storeClient: this.lockService.client(),
      keyPrefix: 'login_fail_by_email',
      points: MAX_FAILED_ATTEMPTS,
      duration: WINDOW_SECONDS,
      blockDuration: LOCKOUT_SECONDS,
    });
  }

  @BeforeHook('/sign-in/email')
  async checkLock(ctx: AuthHookContext): Promise<void> {
    const email = extractNormalizedEmail(ctx);
    if (!email) return;

    const res = await this.limiter.get(email);
    if (res !== null && res.remainingPoints <= 0) {
      const retrySecs = Math.max(1, Math.ceil(res.msBeforeNext / 1000));
      const { APIError } = await import('better-auth');
      throw new APIError('TOO_MANY_REQUESTS', {
        code: 'AUTH_LOGIN_LOCKED',
        detail: `Too many failed login attempts. Try again in ${retrySecs} seconds.`,
      });
    }
  }

  @AfterHook('/sign-in/email')
  async trackResult(ctx: AuthHookContext): Promise<void> {
    const email = extractNormalizedEmail(ctx);
    if (!email) return;

    const returned = (ctx as { returned?: unknown }).returned;
    if (!this.isLoginFailure(returned)) {
      await this.limiter.delete(email);
      return;
    }

    try {
      await this.limiter.consume(email);
    } catch (rlRejected) {
      if (rlRejected instanceof Error) throw rlRejected;
      const res = rlRejected as RateLimiterRes;
      this.logger.warn(`login_lockout_activated email=${email} retryAfterMs=${res.msBeforeNext}`);
    }
  }

  private isLoginFailure(value: unknown): value is ApiErrorLike {
    return (
      !!value &&
      typeof value === 'object' &&
      'statusCode' in value &&
      (value as ApiErrorLike).statusCode === 401
    );
  }
}
