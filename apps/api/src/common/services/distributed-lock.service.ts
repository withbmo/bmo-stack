import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redlock } from '@sesamecare-oss/redlock';
import { Redis } from 'ioredis';

type LockRunResult<T> =
  | { acquired: false }
  | { acquired: true; result: T };

@Injectable()
export class DistributedLockService implements OnModuleDestroy {
  private readonly logger = new Logger(DistributedLockService.name);
  private readonly redis: Redis;
  private readonly redlock: Redlock;

  constructor(private readonly configService: ConfigService) {
    const redisUrl = this.configService.get<string>('REDIS_URL')?.trim();
    if (!redisUrl) {
      throw new Error('REDIS_URL is required.');
    }

    this.redis = new Redis(redisUrl, { maxRetriesPerRequest: null });

    this.redlock = new Redlock([this.redis], { retryCount: 0 });
    this.redlock.on('clientError', (error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.debug(`distributed_lock_client_error ${message}`);
    });
  }

  client(): Redis {
    return this.redis;
  }

  async onModuleDestroy(): Promise<void> {
    await this.redis.quit().catch(() => this.redis.disconnect());
  }

  async runWithLock<T>(
    resource: string,
    ttlMs: number,
    fn: () => Promise<T>
  ): Promise<LockRunResult<T>> {
    let lock: Awaited<ReturnType<Redlock['acquire']>>;
    try {
      lock = await this.redlock.acquire([resource], ttlMs);
    } catch {
      return { acquired: false };
    }

    try {
      const result = await fn();
      return { acquired: true, result };
    } finally {
      await lock.release().catch(() => undefined);
    }
  }
}
