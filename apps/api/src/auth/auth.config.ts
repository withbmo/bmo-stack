import { ConfigService } from '@nestjs/config';

/**
 * Get JWT secret from config (JWT_SECRET). Used in both production and development.
 * Fails fast in production if not set; uses env default in development when unset.
 */
export function getJwtSecret(configService: ConfigService): string {
  const secret = configService.get<string>('JWT_SECRET');
  const isProd = configService.get<string>('NODE_ENV') === 'production';
  if (!secret || secret === '') {
    if (isProd) {
      throw new Error('JWT_SECRET must be set in production');
    }
    return 'dev-secret';
  }
  return secret;
}
