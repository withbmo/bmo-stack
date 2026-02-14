import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile,Strategy } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(configService: ConfigService) {
    const clientID =
      configService.get<string>('GITHUB_CLIENT_ID') || 'dev-github-client-id';
    const clientSecret =
      configService.get<string>('GITHUB_CLIENT_SECRET') || 'dev-github-client-secret';

    super({
      clientID,
      clientSecret,
      callbackURL: configService.get<string>('GITHUB_CALLBACK_URL') ||
        'http://localhost:3001/api/v1/oauth/github/callback',
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any) => void
  ): Promise<any> {
    const { id, emails, displayName, photos } = profile;

    const user = {
      provider: 'github' as const,
      providerId: id,
      email: emails?.[0]?.value || `${id}@github.user`,
      name: displayName,
      avatarUrl: photos?.[0]?.value,
      accessToken,
      refreshToken,
    };

    done(null, user);
  }
}
