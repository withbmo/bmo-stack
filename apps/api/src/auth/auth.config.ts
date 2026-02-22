import type { ConfigService } from '@nestjs/config';

import { JWT_EXPIRES_IN_DEFAULT, JWT_SECRET_DEFAULT } from '../config/defaults';

/**
 * JWT configuration helpers used for API-generated tokens
 * (for example password reset token wrapping).
 *
 * @module AuthConfig
 * @description Provides utility functions for retrieving JWT configuration
 * from environment variables with safe defaults for development.
 */

/**
 * Retrieves the JWT secret from configuration.
 *
 * In production, the JWT_SECRET environment variable must be set.
 * In development, falls back to 'dev-secret' if not configured.
 *
 * @param {ConfigService} configService - NestJS configuration service
 * @returns {string} The JWT secret key
 * @throws {Error} If JWT_SECRET is not set in production environment
 *
 * @example
 * ```typescript
 * const secret = getJwtSecret(configService);
 * // Returns process.env.JWT_SECRET or 'dev-secret' in development
 * ```
 */
export function getJwtSecret(configService: ConfigService): string {
  const secret = configService.get<string>('JWT_SECRET');
  const isProd = configService.get<string>('NODE_ENV') === 'production';
  if (!secret || secret === '') {
    if (isProd) {
      throw new Error('JWT_SECRET must be set in production');
    }
    return JWT_SECRET_DEFAULT;
  }
  return secret;
}

/**
 * Retrieves the JWT token expiration time from configuration.
 *
 * Returns the value from JWT_EXPIRES_IN environment variable,
 * or falls back to JWT_EXPIRES_IN_DEFAULT ('15m') if not set.
 *
 * @param {ConfigService} configService - NestJS configuration service
 * @returns {string} The JWT expiration time (e.g., '15m', '1h', '7d')
 *
 * @example
 * ```typescript
 * const expiresIn = getJwtExpiresIn(configService);
 * // Returns '15m' (default) or process.env.JWT_EXPIRES_IN
 * ```
 */
export function getJwtExpiresIn(configService: ConfigService): string {
  const raw = configService.get<string>('JWT_EXPIRES_IN');
  return raw && raw.trim() !== '' ? raw.trim() : JWT_EXPIRES_IN_DEFAULT;
}
