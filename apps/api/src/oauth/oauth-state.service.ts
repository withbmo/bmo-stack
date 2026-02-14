import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { createClient } from 'redis';

const STATE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const STATE_TTL_SEC = 5 * 60;
const STATE_BYTES = 32;
const KEY_PREFIX = 'oauth_state:';

interface StoredState {
  expiresAt: number;
}

/**
 * In-memory store for OAuth state values (short-lived, single-use).
 * Used to protect OAuth flows against CSRF.
 *
 * For multi-instance deployments, consider Redis or similar.
 */
@Injectable()
export class OauthStateService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OauthStateService.name);
  private readonly store = new Map<string, StoredState>();
  private readonly redisUrl?: string;
  private redis?: ReturnType<typeof createClient>;

  constructor(private readonly configService: ConfigService) {
    this.redisUrl = this.configService.get<string>('REDIS_URL') || undefined;
  }

  async onModuleInit() {
    if (!this.redisUrl) return;
    if (
      !this.redisUrl.startsWith('redis://') &&
      !this.redisUrl.startsWith('rediss://')
    ) {
      this.logger.warn(
        'REDIS_URL is set but does not use redis:// or rediss://. Falling back to memory store.'
      );
      return;
    }
    const client = createClient({ url: this.redisUrl });
    client.on('error', (err: unknown) => {
      this.logger.warn(`Redis error: ${err instanceof Error ? err.message : String(err)}`);
    });
    try {
      await client.connect();
      this.redis = client;
      this.logger.log('OAuth state store using Redis');
    } catch (err) {
      this.logger.warn(
        `Failed to connect to Redis for OAuth state store, falling back to memory: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      try {
        await client.disconnect();
      } catch {
        // ignore
      }
      this.redis = undefined;
    }
  }

  async onModuleDestroy() {
    if (this.redis) {
      await this.redis.disconnect();
      this.redis = undefined;
    }
  }

  private pruneExpired(now: number) {
    for (const [state, entry] of this.store.entries()) {
      if (now > entry.expiresAt) this.store.delete(state);
    }
  }

  private key(state: string) {
    return `${KEY_PREFIX}${state}`;
  }

  async createState(): Promise<string> {
    if (this.redis) {
      for (let attempt = 0; attempt < 3; attempt += 1) {
        const state = crypto.randomBytes(STATE_BYTES).toString('hex');
        const ok = await this.redis.set(this.key(state), '1', {
          EX: STATE_TTL_SEC,
          NX: true,
        });
        if (ok) return state;
      }
      throw new Error('Failed to create OAuth state');
    }
    this.pruneExpired(Date.now());
    const state = crypto.randomBytes(STATE_BYTES).toString('hex');
    this.store.set(state, { expiresAt: Date.now() + STATE_TTL_MS });
    return state;
  }

  async consumeState(state: string): Promise<boolean> {
    if (this.redis) {
      const value = await this.redis.getDel(this.key(state));
      return value !== null;
    }
    this.pruneExpired(Date.now());
    const entry = this.store.get(state);
    this.store.delete(state);
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) return false;
    return true;
  }
}
