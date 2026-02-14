import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    const clientID =
      configService.get<string>('GOOGLE_CLIENT_ID') || 'dev-google-client-id';
    const clientSecret =
      configService.get<string>('GOOGLE_CLIENT_SECRET') || 'dev-google-client-secret';

    super({
      clientID,
      clientSecret,
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') ||
        'http://localhost:3001/api/v1/oauth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ): Promise<any> {
    const { id, emails, displayName, photos } = profile;

    const user = {
      provider: 'google' as const,
      providerId: id,
      email: emails[0].value,
      name: displayName,
      avatarUrl: photos?.[0]?.value,
      accessToken,
      refreshToken,
    };

    done(null, user);
  }
}
