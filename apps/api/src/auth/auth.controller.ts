import { Body, Controller, Get, Logger, Post, Query, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import type { PasswordStrengthResponse } from '@pytholit/contracts';
import { getPasswordStrength } from '@pytholit/validation';
import type { Request, Response } from 'express';

import { AuthFlowService } from './auth-flow.service';
import { Public } from './decorators/public.decorator';
import { CheckPasswordStrengthDto } from './dto/check-password-strength.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginPasswordDto } from './dto/login-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { SignupPasswordDto } from './dto/signup-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

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

  constructor(
    private readonly configService: ConfigService,
    private readonly authFlowService: AuthFlowService
  ) {}

  @Get('providers')
  getProviders(): { providers: Array<'google' | 'github'> } {
    const hasGoogle =
      Boolean(this.configService.get<string>('GOOGLE_CLIENT_ID')?.trim()) &&
      Boolean(this.configService.get<string>('GOOGLE_CLIENT_SECRET')?.trim());
    const hasGithub =
      Boolean(this.configService.get<string>('GITHUB_CLIENT_ID')?.trim()) &&
      Boolean(this.configService.get<string>('GITHUB_CLIENT_SECRET')?.trim());

    const providers: Array<'google' | 'github'> = [];
    if (hasGoogle) providers.push('google');
    if (hasGithub) providers.push('github');
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

  @Post('signup-password')
  @Throttle({ auth: { limit: 5, ttl: 60000 } })
  async signupPassword(
    @Body() body: SignupPasswordDto,
    @Req() req: Request
  ) {
    return this.authFlowService.signupPassword(
      body,
      this.toHeaders(req),
      req.ip,
      req.get('user-agent') ?? undefined
    );
  }

  @Post('login-password')
  @Throttle({ auth: { limit: 10, ttl: 60000 } })
  async loginPassword(
    @Body() body: LoginPasswordDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authFlowService.loginPassword(
      body,
      this.toHeaders(req),
      req.ip,
      req.get('user-agent') ?? undefined
    );
    if (result.setCookies?.length) {
      res.setHeader('Set-Cookie', result.setCookies);
    }
    const { setCookies: _setCookies, ...payload } = result;
    return payload;
  }

  @Post('otp/send')
  @Throttle({ 'strict-auth': { limit: 5, ttl: 60000 } })
  async sendOtp(
    @Body() body: SendOtpDto,
    @Req() req: Request
  ) {
    return this.authFlowService.sendOtp(
      body,
      this.toHeaders(req),
      req.ip,
      req.get('user-agent') ?? undefined
    );
  }

  @Post('otp/verify')
  @Throttle({ 'strict-auth': { limit: 10, ttl: 60000 } })
  async verifyOtp(
    @Body() body: VerifyOtpDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authFlowService.verifyOtp(body, this.toHeaders(req), req.ip);
    if (result.setCookies?.length) {
      res.setHeader('Set-Cookie', result.setCookies);
    }
    const { setCookies: _setCookies, ...payload } = result;
    return payload;
  }

  @Post('password/forgot')
  @Throttle({ 'strict-auth': { limit: 5, ttl: 60000 } })
  async forgotPassword(
    @Body() body: ForgotPasswordDto,
    @Req() req: Request
  ) {
    return this.authFlowService.forgotPassword(body, this.toHeaders(req));
  }

  @Post('password/reset')
  @Throttle({ 'strict-auth': { limit: 10, ttl: 60000 } })
  async resetPassword(
    @Body() body: ResetPasswordDto,
    @Req() req: Request
  ) {
    return this.authFlowService.resetPassword(body, this.toHeaders(req));
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

  private toHeaders(req: Request): Headers {
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (Array.isArray(value)) {
        for (const entry of value) headers.append(key, entry);
      } else if (typeof value === 'string') {
        headers.set(key, value);
      }
    }
    return headers;
  }
}
