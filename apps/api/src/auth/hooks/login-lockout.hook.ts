import { Injectable, Logger } from '@nestjs/common';
import { AfterHook, type AuthHookContext, BeforeHook, Hook } from '@thallesp/nestjs-better-auth';

import { isPrismaUniqueViolation } from '../../common/utils/prisma-error.utils';
import { DistributedLockService } from '../../common/services/distributed-lock.service';
import { PrismaService } from '../../database/prisma.service';
import { extractNormalizedEmail } from './auth-hook.utils';

const MAX_FAILED_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const LOCKOUT_MS = 10 * 60 * 1000; // 10 minutes
const LOGIN_LOCK_LOCK_TTL_MS = 5 * 1000;

type ApiErrorLike = {
  statusCode?: number;
  body?: {
    message?: string;
  };
};

@Hook()
@Injectable()
export class LoginLockoutHook {
  private readonly logger = new Logger(LoginLockoutHook.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly lockService: DistributedLockService
  ) {}

  @BeforeHook('/sign-in/email')
  async checkLock(ctx: AuthHookContext): Promise<void> {
    const email = extractNormalizedEmail(ctx);
    if (!email) return;

    const now = new Date();
    const attempt = await this.prisma.client.authLoginAttempt.findUnique({
      where: { email },
    });
    if (!attempt) return;

    // Auto-clean expired lock / stale attempt window.
    if (
      (attempt.lockedUntil && attempt.lockedUntil <= now) ||
      ((attempt.lastFailedAt ?? attempt.firstFailedAt) &&
        now.getTime() - (attempt.lastFailedAt ?? attempt.firstFailedAt)!.getTime() > WINDOW_MS)
    ) {
      await this.resetAttempt(email);
      return;
    }

    if (attempt.lockedUntil && attempt.lockedUntil > now) {
      const remainingSeconds = Math.max(
        1,
        Math.ceil((attempt.lockedUntil.getTime() - now.getTime()) / 1000)
      );
      const authApi = await import('better-auth');
      throw new authApi.APIError('TOO_MANY_REQUESTS', {
        code: 'AUTH_LOGIN_LOCKED',
        detail: `Too many failed login attempts. Try again in ${remainingSeconds} seconds.`,
      });
    }
  }

  @AfterHook('/sign-in/email')
  async trackResult(ctx: AuthHookContext): Promise<void> {
    const email = extractNormalizedEmail(ctx);
    if (!email) return;

    const returned = (ctx as { returned?: unknown }).returned;
    if (!this.isApiErrorLike(returned)) {
      await this.resetAttempt(email);
      return;
    }

    if (returned.statusCode !== 401) {
      return;
    }

    await this.incrementFailure(email);
  }

  private async incrementFailure(email: string): Promise<void> {
    const lock = await this.lockService.runWithLock(
      this.loginLockResource(email),
      LOGIN_LOCK_LOCK_TTL_MS,
      () => this.incrementFailureInsideLock(email)
    );
    if (!lock.acquired) {
      this.logger.debug(`login_lockout_increment_skipped lock_unavailable email=${email}`);
    }
  }

  private async incrementFailureInsideLock(email: string): Promise<void> {
    const now = new Date();
    const existing = await this.prisma.client.authLoginAttempt.findUnique({
      where: { email },
    });

    if (!existing) {
      try {
        await this.prisma.client.authLoginAttempt.create({
          data: {
            email,
            failedAttempts: 1,
            firstFailedAt: now,
            lastFailedAt: now,
            lockedUntil: null,
          },
        });
        return;
      } catch (error) {
        // Parallel failed-login requests can race on unique email.
        if (!isPrismaUniqueViolation(error)) {
          throw error;
        }
      }
    }

    const current =
      existing ??
      (await this.prisma.client.authLoginAttempt.findUnique({
        where: { email },
      }));
    if (!current) return;

    const windowAnchor = current.lastFailedAt ?? current.firstFailedAt;
    const windowExpired = !windowAnchor || now.getTime() - windowAnchor.getTime() > WINDOW_MS;

    const failedAttempts = windowExpired ? 1 : current.failedAttempts + 1;
    const firstFailedAt = windowExpired ? now : current.firstFailedAt ?? now;
    const lockedUntil =
      failedAttempts >= MAX_FAILED_ATTEMPTS ? new Date(now.getTime() + LOCKOUT_MS) : null;

    await this.prisma.client.authLoginAttempt.update({
      where: { email },
      data: {
        failedAttempts,
        firstFailedAt,
        lastFailedAt: now,
        lockedUntil,
      },
    });

    if (lockedUntil) {
      this.logger.warn(
        `login_lockout_activated email=${email} failedAttempts=${failedAttempts} lockedUntil=${lockedUntil.toISOString()}`
      );
    }
  }

  private async resetAttempt(email: string): Promise<void> {
    const lock = await this.lockService.runWithLock(
      this.loginLockResource(email),
      LOGIN_LOCK_LOCK_TTL_MS,
      async () => {
        await this.prisma.client.authLoginAttempt.updateMany({
          where: { email },
          data: {
            failedAttempts: 0,
            firstFailedAt: null,
            lastFailedAt: null,
            lockedUntil: null,
          },
        });
      }
    );
    if (!lock.acquired) {
      this.logger.debug(`login_lockout_reset_skipped lock_unavailable email=${email}`);
    }
  }

  private isApiErrorLike(value: unknown): value is ApiErrorLike {
    return (
      !!value &&
      typeof value === 'object' &&
      'statusCode' in value &&
      typeof (value as { statusCode?: unknown }).statusCode === 'number'
    );
  }

  private loginLockResource(email: string): string {
    return `lock:auth:login-lockout:${email}`;
  }
}
