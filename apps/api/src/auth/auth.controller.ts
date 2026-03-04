import { Body, Controller, Get, Logger, Post, Query, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import type { PasswordStrengthResponse } from '@pytholit/contracts';
import { getPasswordStrength } from '@pytholit/validation';
import type { Response } from 'express';

import { OAUTH_PROVIDERS, type OAuthProviderKey } from './auth-providers.config';
import { Public } from './decorators/public.decorator';
import { CheckPasswordStrengthDto } from './dto/check-password-strength.dto';

/**
 * Auth controller for custom auth endpoints not handled by Better Auth module.
 *
 * Better Auth handles standard auth flows (login, signup, OAuth, session management).
 * This controller provides additional endpoints for password strength checking.
 *
 * All endpoints in this controller are publicly accessible and rate-limited
 * to prevent abuse.
 *
 * @class AuthController
 * @Controller('auth-flow')
 * @Public - All endpoints are publicly accessible
 */
@Controller('auth-flow')
@Public()
@Throttle({ auth: { limit: 5, ttl: 60000 } }) // 5 requests per minute for auth endpoints
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly configService: ConfigService) {}

  @Get('providers')
  @SkipThrottle()
  getProviders(): { providers: OAuthProviderKey[] } {
    const providers = (Object.entries(OAUTH_PROVIDERS) as [OAuthProviderKey, (typeof OAUTH_PROVIDERS)[OAuthProviderKey]][])
      .filter(([, def]) =>
        Boolean(this.configService.get<string>(def.clientIdKey)?.trim()) &&
        Boolean(this.configService.get<string>(def.clientSecretKey)?.trim())
      )
      .map(([key]) => key);

    return { providers };
  }

  /**
   * Checks password strength without storing anything.
   *
   * This endpoint provides real-time password strength feedback for UI validation.
   * It uses zxcvbn algorithm to analyze password patterns and estimate crack times.
   *
   * **Rate Limiting:** 20 requests per minute (more permissive for UX)
   *
   * **Security:** Password is received in request body (not query string) to avoid
   * accidental exposure in URL logs/history.
   *
   * @param {string} password - Password to analyze (request body)
   * @returns {PasswordStrengthResponse} Strength analysis result
   * @returns {number} returns.score - Strength score (0-4, where 4 is strongest)
   * @returns {string} returns.label - Human-readable label ("Too Weak" to "Very Strong")
   * @returns {string} returns.crackTime - Estimated time to crack offline
   * @returns {string[]} returns.feedback - Actionable improvement suggestions
   * @returns {boolean} returns.isStrong - Whether password meets minimum strength (score >= 3)
   *
   * @example
   * ```http
   * POST /api/v1/auth-flow/check-password-strength
   * Content-Type: application/json
   *
   * { "password": "MyPassword123" }
   *
   * Response:
   * {
   *   "score": 3,
   *   "label": "Strong",
   *   "crackTime": "3 days",
   *   "feedback": ["Use a few words, avoid common phrases"],
   *   "isStrong": true
   * }
   * ```
   *
   * @see {@link getPasswordStrength}
   */
  @Post('check-password-strength')
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // More permissive for UX
  checkPasswordStrength(@Body() body: CheckPasswordStrengthDto): PasswordStrengthResponse {
    return getPasswordStrength(body.password);
  }

  /**
   * Deprecated compatibility shim for one release cycle.
   * Use POST /auth-flow/check-password-strength instead.
   */
  @Get('check-password-strength')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  checkPasswordStrengthDeprecated(
    @Query('password') password: string,
    @Res({ passthrough: true }) res: Response
  ): PasswordStrengthResponse {
    res.setHeader('Deprecation', 'true');
    res.setHeader('Sunset', 'Release N+1');
    this.logger.warn('Deprecated GET /auth-flow/check-password-strength used. Switch to POST body.');
    return getPasswordStrength(password ?? '');
  }
}
