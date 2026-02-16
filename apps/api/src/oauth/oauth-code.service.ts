import { Injectable, Logger, OnModuleDestroy, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { LoginResponse } from '@pytholit/contracts';
import * as crypto from 'crypto';
import { createClient } from 'redis';

const CODE_TTL_MS = 60 * 1000; // 60 seconds
const CODE_TTL_SEC = 60;
const CODE_BYTES = 32;
const KEY_PREFIX = 'oauth_code:';

interface StoredCode {
  result: LoginResponse;
  expiresAt: number;
}

/**
 * OAuth authorization code storage with Redis support.
 * Used to avoid passing JWT tokens in redirect URLs.
 *
 * - Production: Uses Redis for multi-instance support
 * - Development: Falls back to in-memory Map if Redis unavailable
 */
@Injectable()
export class OauthCodeService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OauthCodeService.name);
  private readonly store = new Map<string, StoredCode>();
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
      this.logger.log('OAuth code store using Redis');
    } catch (err) {
      this.logger.warn(
        `Failed to connect to Redis for OAuth code store, falling back to memory: ${
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
    for (const [code, entry] of this.store.entries()) {
      if (now > entry.expiresAt) this.store.delete(code);
    }
  }

  private key(code: string) {
    return `${KEY_PREFIX}${code}`;
  }

  /**
   * Create a code and store the login result.
   * Returns the code to include in the redirect URL.
   */
  async createCode(result: LoginResponse): Promise<string> {
    if (this.redis) {
      for (let attempt = 0; attempt < 3; attempt += 1) {
        const code = crypto.randomBytes(CODE_BYTES).toString('hex');
        const ok = await this.redis.set(
          this.key(code),
          JSON.stringify(result),
          {
            EX: CODE_TTL_SEC,
            NX: true,
          }
        );
        if (ok) return code;
      }
      throw new Error('Failed to create OAuth code');
    }
    this.pruneExpired(Date.now());
    const code = crypto.randomBytes(CODE_BYTES).toString('hex');
    this.store.set(code, {
      result,
      expiresAt: Date.now() + CODE_TTL_MS,
    });
    return code;
  }

  /**
   * Exchange a code for the login result.
   * Code is consumed (single-use) and invalidated.
   */
  async exchangeCode(code: string): Promise<LoginResponse> {
    if (this.redis) {
      const value = await this.redis.getDel(this.key(code));
      if (!value) {
        throw new UnauthorizedException('Invalid or expired OAuth code');
      }
      return JSON.parse(value) as LoginResponse;
    }
    this.pruneExpired(Date.now());
    const entry = this.store.get(code);
    this.store.delete(code);

    if (!entry) {
      throw new UnauthorizedException('Invalid or expired OAuth code');
    }

    if (Date.now() > entry.expiresAt) {
      throw new UnauthorizedException('OAuth code has expired');
    }

    return entry.result;
  }
}

