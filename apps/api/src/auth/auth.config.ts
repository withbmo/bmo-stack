import { ConfigService } from '@nestjs/config';

/**
 * Get JWT secret. Fails fast in production if not set.
 */
export function getJwtSecret(configService: ConfigService): string {
  const secret = configService.get<string>('JWT_SECRET');
  const isProd = configService.get<string>('NODE_ENV') === 'production';
  if (!secret || secret === '') {
    if (isProd) {
      throw new Error('JWT_SECRET must be set in production');
    }
    return 'dev-secret-do-not-use-in-production';
  }
  return secret;
}
