import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { GithubOauthCallbackGuard } from './guards/github-oauth-callback.guard';
import { GithubOauthStateGuard } from './guards/github-oauth-state.guard';
import { GoogleOauthCallbackGuard } from './guards/google-oauth-callback.guard';
import { GoogleOauthStateGuard } from './guards/google-oauth-state.guard';
import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';
import { OauthCodeService } from './oauth-code.service';
import { OauthStateService } from './oauth-state.service';
import { GithubStrategy } from './strategies/github.strategy';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [ConfigModule, AuthModule, UsersModule],
  controllers: [OauthController],
  providers: [
    OauthService,
    OauthCodeService,
    OauthStateService,
    GoogleStrategy,
    GithubStrategy,
    GoogleOauthStateGuard,
    GithubOauthStateGuard,
    GoogleOauthCallbackGuard,
    GithubOauthCallbackGuard,
  ],
  exports: [OauthService],
})
export class OauthModule {}
