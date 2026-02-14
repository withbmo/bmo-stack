import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { GithubOauthStateGuard } from './guards/github-oauth-state.guard';
import { GoogleOauthStateGuard } from './guards/google-oauth-state.guard';
import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';
import { OauthCodeService } from './oauth-code.service';
import { OauthStateService } from './oauth-state.service';
import { GithubStrategy } from './strategies/github.strategy';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [AuthModule],
  controllers: [OauthController],
  providers: [
    OauthService,
    OauthCodeService,
    OauthStateService,
    GoogleStrategy,
    GithubStrategy,
    GoogleOauthStateGuard,
    GithubOauthStateGuard,
  ],
  exports: [OauthService],
})
export class OauthModule {}
