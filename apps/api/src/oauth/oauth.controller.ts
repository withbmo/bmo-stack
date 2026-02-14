import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  Res,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { OauthService, OAuthProfile } from './oauth.service';
import { OauthCodeService } from './oauth-code.service';
import { OauthStateService } from './oauth-state.service';
import { ExchangeCodeDto } from './dto/exchange-code.dto';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { GoogleOauthStateGuard } from './guards/google-oauth-state.guard';
import { GithubOauthStateGuard } from './guards/github-oauth-state.guard';
import type { Request, Response } from 'express';

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

  // Google OAuth
  @Public()
  @Get('google')
  @UseGuards(GoogleOauthStateGuard)
  async googleAuth() {
    // Initiates Google OAuth flow
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const state = typeof req.query?.state === 'string' ? req.query.state : '';
    if (!state || !(await this.oauthStateService.consumeState(state))) {
      throw new UnauthorizedException('Invalid OAuth state');
    }
    const profile = req.user as OAuthProfile;
    const result = await this.oauthService.handleOAuthLogin(profile);
    const code = this.oauthCodeService.createCode(result);
    const redirectUrl = `${this.frontendUrl}/auth/callback?code=${code}`;
    res.redirect(redirectUrl);
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
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req: Request, @Res() res: Response) {
    const state = typeof req.query?.state === 'string' ? req.query.state : '';
    if (!state || !(await this.oauthStateService.consumeState(state))) {
      throw new UnauthorizedException('Invalid OAuth state');
    }
    const profile = req.user as OAuthProfile;
    const result = await this.oauthService.handleOAuthLogin(profile);
    const code = this.oauthCodeService.createCode(result);
    const redirectUrl = `${this.frontendUrl}/auth/callback?code=${code}`;
    res.redirect(redirectUrl);
  }

  /**
   * Exchange a short-lived OAuth code for the access token.
   * Code is single-use and expires in 60 seconds.
   */
  @Public()
  @Post('exchange')
  @HttpCode(HttpStatus.OK)
  async exchangeCode(@Body() dto: ExchangeCodeDto) {
    return this.oauthCodeService.exchangeCode(dto.code);
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
