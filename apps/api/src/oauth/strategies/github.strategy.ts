import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { parseGithubPassportProfile, pickVerifiedGithubEmail } from '@pytholit/validation/zod';
import { Profile,Strategy } from 'passport-github2';

async function fetchGithubEmails(accessToken: string): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'pytholit',
      },
      signal: controller.signal,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    done: (error: any, user?: any, info?: any) => void
  ): Promise<any> {
    try {
      const parsed = parseGithubPassportProfile(profile);
      const emailsJson = await fetchGithubEmails(accessToken);
      if (!emailsJson) {
        done(null, false, { message: 'github_email_required' });
        return;
      }

      const verifiedEmail = pickVerifiedGithubEmail(emailsJson);
      if (!verifiedEmail) {
        done(null, false, { message: 'github_email_required' });
        return;
      }

      const fullName = (parsed.displayName || '').trim() || (parsed.username || '').trim();
      const parts = fullName.split(/\s+/).filter(Boolean);
      const firstName = parts.length > 1 ? parts[0] : undefined;
      const lastName = parts.length > 1 ? parts.slice(1).join(' ') : undefined;

      done(null, {
        provider: 'github' as const,
        providerId: parsed.id,
        email: verifiedEmail,
        emailVerified: true,
        firstName,
        lastName,
        name: parsed.displayName || undefined,
        avatarUrl: parsed.avatarUrl,
        accessToken,
        refreshToken,
      });
    } catch {
      done(new Error('oauth_profile_invalid'));
    }
  }
}
