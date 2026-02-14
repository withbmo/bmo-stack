import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { LoginResponse } from '@pytholit/contracts';
import * as crypto from 'crypto';

const CODE_TTL_MS = 60 * 1000; // 60 seconds
const CODE_BYTES = 32;

interface StoredCode {
  result: LoginResponse;
  expiresAt: number;
}

/**
 * In-memory store for OAuth codes (short-lived, single-use).
 * Used to avoid passing JWT tokens in redirect URLs.
 *
 * For multi-instance deployments, consider Redis or similar.
 */
@Injectable()
export class OauthCodeService {
  private readonly store = new Map<string, StoredCode>();

  private pruneExpired(now: number) {
    for (const [code, entry] of this.store.entries()) {
      if (now > entry.expiresAt) this.store.delete(code);
    }
  }

  /**
   * Create a code and store the login result.
   * Returns the code to include in the redirect URL.
   */
  createCode(result: LoginResponse): string {
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
  exchangeCode(code: string): LoginResponse {
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
