import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';

import {
  clearOauthNextCookie,
  clearOauthStateCookie,
  setAuthCookie,
} from '../auth/auth.cookies';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { ExchangeCodeDto } from './dto/exchange-code.dto';
import { GithubOauthCallbackGuard } from './guards/github-oauth-callback.guard';
import { GithubOauthStateGuard } from './guards/github-oauth-state.guard';
import { GoogleOauthCallbackGuard } from './guards/google-oauth-callback.guard';
import { GoogleOauthStateGuard } from './guards/google-oauth-state.guard';
import { OAuthProfile,OauthService } from './oauth.service';
import { OauthCodeService } from './oauth-code.service';
import { OauthStateService } from './oauth-state.service';

/**
 * OAuth Controller
 * Handles OAuth authentication flows for Google and GitHub.
 * Uses short-lived codes instead of tokens in URL for security.
 */
@Controller('oauth')
export class OauthController {
  private readonly frontendUrl: string;

  constructor(
    private readonly oauthService: OauthService,
    private readonly oauthCodeService: OauthCodeService,
    private readonly oauthStateService: OauthStateService,
    private readonly configService: ConfigService
  ) {
    this.frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
  }

  private redirectError(res: Response, code: string) {
    const qs = new URLSearchParams({ error: code });
    res.redirect(`${this.frontendUrl}/auth/login?${qs.toString()}`);
  }

  private async validateAndConsumeState(req: Request): Promise<boolean> {
    const state = typeof req.query?.state === 'string' ? req.query.state : '';
    const cookieState = (req as any).cookies?.oauth_state;
    if (!state || !cookieState || state !== cookieState) return false;
    return this.oauthStateService.consumeState(state);
  }

  // Google OAuth
  @Public()
  @Get('google')
  @UseGuards(GoogleOauthStateGuard)
  async googleAuth() {
    // Initiates Google OAuth flow
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleOauthCallbackGuard)
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    clearOauthStateCookie(res);
    clearOauthNextCookie(res);

    const ok = await this.validateAndConsumeState(req);
    if (!ok) return this.redirectError(res, 'oauth_state_invalid');

    if (!req.user) return this.redirectError(res, 'oauth_failed');

    try {
      const profile = req.user as OAuthProfile;
      const result = await this.oauthService.handleOAuthLogin(profile);
      setAuthCookie(res, result.accessToken);
      const next = (req as any).cookies?.oauth_next;
      const target =
        typeof next === 'string' && next.startsWith('/') && !next.startsWith('//')
          ? next
          : '/dashboard';
      return res.redirect(`${this.frontendUrl}${target}`);
    } catch {
      return this.redirectError(res, 'oauth_login_failed');
    }
  }

  // GitHub OAuth
  @Public()
  @Get('github')
  @UseGuards(GithubOauthStateGuard)
  async githubAuth() {
    // Initiates GitHub OAuth flow
  }

  @Public()
  @Get('github/callback')
  @UseGuards(GithubOauthCallbackGuard)
  async githubCallback(@Req() req: Request, @Res() res: Response) {
    clearOauthStateCookie(res);
    clearOauthNextCookie(res);

    const ok = await this.validateAndConsumeState(req);
    if (!ok) return this.redirectError(res, 'oauth_state_invalid');

    if (!req.user) {
      const err = (req as any).oauthError;
      const code = err?.message === 'github_email_required' ? 'github_email_required' : 'oauth_failed';
      return this.redirectError(res, code);
    }

    try {
      const profile = req.user as OAuthProfile;
      const result = await this.oauthService.handleOAuthLogin(profile);
      setAuthCookie(res, result.accessToken);
      const next = (req as any).cookies?.oauth_next;
      const target =
        typeof next === 'string' && next.startsWith('/') && !next.startsWith('//')
          ? next
          : '/dashboard';
      return res.redirect(`${this.frontendUrl}${target}`);
    } catch {
      return this.redirectError(res, 'oauth_login_failed');
    }
  }

  /**
   * Exchange a short-lived OAuth code for the access token.
   * Code is single-use and expires in 60 seconds.
   */
  @Public()
  @Post('exchange')
  @HttpCode(HttpStatus.OK)
  async exchangeCode(@Body() dto: ExchangeCodeDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.oauthCodeService.exchangeCode(dto.code);
    setAuthCookie(res, result.accessToken);
    return result;
  }

  // Unlink OAuth account
  @Delete(':provider')
  @HttpCode(HttpStatus.OK)
  async unlinkAccount(
    @CurrentUser() user: any,
    @Param('provider') provider: 'google' | 'github'
  ): Promise<{ message: string }> {
    return this.oauthService.unlinkOAuthAccount(user.id, provider);
  }
}
