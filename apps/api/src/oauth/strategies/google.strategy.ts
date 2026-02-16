import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { parseGoogleOAuthProfile } from '@pytholit/validation/zod';

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
    profile: unknown,
    done: VerifyCallback
  ): Promise<any> {
    try {
      const parsed = parseGoogleOAuthProfile(profile);
      done(null, {
        provider: 'google' as const,
        providerId: parsed.id,
        email: parsed.email,
        emailVerified: parsed.emailVerified,
        firstName: parsed.firstName,
        lastName: parsed.lastName,
        name: parsed.name,
        avatarUrl: parsed.avatarUrl,
        accessToken,
        refreshToken,
      });
    } catch {
      done(new Error('oauth_profile_invalid'));
    }
  }
}
