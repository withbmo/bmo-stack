import { Module } from '@nestjs/common';
import { OauthController } from './oauth.controller';
import { OauthService } from './oauth.service';
import { OauthCodeService } from './oauth-code.service';
import { OauthStateService } from './oauth-state.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { GithubStrategy } from './strategies/github.strategy';
import { AuthModule } from '../auth/auth.module';
import { GoogleOauthStateGuard } from './guards/google-oauth-state.guard';
import { GithubOauthStateGuard } from './guards/github-oauth-state.guard';

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
