import { Body, Controller, Get, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import type { EnabledOAuthProvidersResponse, PasswordStrengthResponse } from '@pytholit/contracts';
import { getPasswordStrength } from '@pytholit/validation';

import { OAUTH_PROVIDERS, type OAuthProviderKey } from './auth-providers.config.js';
import { Public } from './decorators/public.decorator.js';
import { CheckPasswordStrengthDto } from './dto/check-password-strength.dto.js';

/**
 * Custom auth endpoints that sit alongside Better Auth.
 *
 * Currently exposes password-strength checking for frontend validation only.
 */
@Controller('auth-flow')
@Public()
@Throttle({ auth: { limit: 5, ttl: 60000 } }) // 5 requests per minute for auth endpoints
export class AuthController {
  constructor(private readonly configService: ConfigService) {}

  @Get('providers')
  @SkipThrottle()
  getProviders(): EnabledOAuthProvidersResponse {
    const providers = (
      Object.entries(OAUTH_PROVIDERS) as [
        OAuthProviderKey,
        (typeof OAUTH_PROVIDERS)[OAuthProviderKey],
      ][]
    )
      .filter(
        ([, def]) =>
          Boolean(this.configService.get<string>(def.clientIdKey)?.trim()) &&
          Boolean(this.configService.get<string>(def.clientSecretKey)?.trim())
      )
      .map(([key]) => key);

    return { providers };
  }

  /**
   * Returns a zxcvbn-based strength evaluation for a password.
   *
   * Used only for client-side UX and does not persist anything.
   */
  @Post('check-password-strength')
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // More permissive for UX
  checkPasswordStrength(@Body() body: CheckPasswordStrengthDto): PasswordStrengthResponse {
    return getPasswordStrength(body.password);
  }
}
