import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import type { LoginResponse } from '@pytholit/contracts';

import { AuthService } from '../auth/auth.service';
import { PrismaService } from '../database/prisma.service';
import { AvatarImportService } from '../users/avatar-import.service';

export interface OAuthProfile {
  provider: 'google' | 'github';
  providerId: string;
  email: string;
  emailVerified: boolean;
  firstName?: string;
  lastName?: string;
  name?: string;
  avatarUrl?: string;
  accessToken: string;
  refreshToken?: string;
}

/**
 * OAuth Service
 * Handles OAuth authentication flow for Google and GitHub
 */
@Injectable()
export class OauthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly avatarImportService: AvatarImportService
  ) {}

  private buildFullName(profile: OAuthProfile): string | null {
    const first = (profile.firstName || '').trim();
    const last = (profile.lastName || '').trim();
    const combined = [first, last].filter(Boolean).join(' ').trim();
    if (combined) return combined;
    const fallback = (profile.name || '').trim();
    return fallback ? fallback : null;
  }

  private splitNames(fullName: string | null): { firstName: string | null; lastName: string | null } {
    if (!fullName) return { firstName: null, lastName: null };
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return { firstName: null, lastName: null };
    if (parts.length === 1) return { firstName: parts[0] ?? null, lastName: null };
    return { firstName: parts[0] ?? null, lastName: parts.slice(1).join(' ') || null };
  }

  private async generateUniqueUsername(base: string): Promise<string> {
    const normalized = base.toLowerCase().replace(/[^a-z0-9_]+/g, '_').replace(/^_+|_+$/g, '');
    const seed = normalized || 'user';
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const suffix = attempt === 0 ? '' : `_${Math.floor(Math.random() * 9000 + 1000)}`;
      const candidate = `${seed}${suffix}`.slice(0, 30);
      const exists = await this.prisma.client.user.findUnique({ where: { username: candidate } });
      if (!exists) return candidate;
    }
    throw new BadRequestException('Failed to generate username');
  }

  async handleOAuthLogin(profile: OAuthProfile): Promise<LoginResponse> {
    if (!profile.emailVerified) {
      throw new UnauthorizedException('OAuth email is not verified');
    }

    // Check if OAuth account exists
    let oauthAccount = await this.prisma.client.oAuthAccount.findUnique({
      where: {
        provider_accountId: {
          provider: profile.provider,
          accountId: profile.providerId,
        },
      },
      include: {
        user: true,
      },
    });

    let user = oauthAccount?.user ?? null;

    // If OAuth account doesn't exist, check if user exists by email
    if (!oauthAccount) {
      user = await this.prisma.client.user.findUnique({ where: { email: profile.email } });

      if (user) {
        // Link OAuth account to existing user
        const fullName = this.buildFullName(profile);
        const split = this.splitNames(fullName);

        user = await this.prisma.client.user.update({
          where: { id: user.id },
          data: {
            ...(user.fullName ? {} : { fullName }),
            ...(user.firstName ? {} : { firstName: split.firstName }),
            ...(user.lastName ? {} : { lastName: split.lastName }),
          },
        });

        oauthAccount = await this.prisma.client.oAuthAccount.create({
          data: {
            userId: user.id,
            provider: profile.provider,
            accountId: profile.providerId,
            accountEmail: profile.email,
            accessToken: null,
            refreshToken: null,
          },
          include: { user: true },
        });
      } else {
        // Create new user and OAuth account
        // Generate username from email
        const emailLocalPart = profile.email.split('@')[0];
        if (!emailLocalPart) {
          throw new BadRequestException('Invalid email from OAuth provider');
        }
        const username = await this.generateUniqueUsername(emailLocalPart);
        const fullName = this.buildFullName(profile);
        const split = this.splitNames(fullName);

        user = await this.prisma.client.user.create({
          data: {
            email: profile.email,
            username,
            fullName,
            firstName: split.firstName,
            lastName: split.lastName,
            // Keep storage semantics consistent: avatars are stored under UPLOAD_DIR and served by the API.
            // Provider URLs are imported best-effort after user creation.
            avatarUrl: null,
            hashedPassword: null, // OAuth users don't have password
            isEmailVerified: true,
          },
        });

        oauthAccount = await this.prisma.client.oAuthAccount.create({
          data: {
            userId: user.id,
            provider: profile.provider,
            accountId: profile.providerId,
            accountEmail: profile.email,
            accessToken: null,
            refreshToken: null,
          },
          include: {
            user: true,
          },
        });
      }
    } else {
      // Keep tokens out of persistent storage (best-effort cleanup)
      if (oauthAccount.accessToken || oauthAccount.refreshToken) {
        await this.prisma.client.oAuthAccount.update({
          where: { id: oauthAccount.id },
          data: { accessToken: null, refreshToken: null },
        });
      }
    }

    if (!user) {
      throw new BadRequestException('User creation failed');
    }

    if (!user.avatarUrl && profile.avatarUrl) {
      await this.avatarImportService.importAvatarIfMissing(user.id, profile.avatarUrl);
      const refreshed = await this.prisma.client.user.findUnique({ where: { id: user.id } });
      if (refreshed) user = refreshed;
    }

    // Generate JWT token
    const accessToken = this.authService.generateAccessToken(user.id);

    return {
      accessToken,
      tokenType: 'bearer',
      expiresIn: 3600,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        firstName: user.firstName ?? null,
        lastName: user.lastName ?? null,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }

  async unlinkOAuthAccount(
    userId: string,
    provider: 'google' | 'github'
  ): Promise<{ message: string }> {
    const oauthAccount = await this.prisma.client.oAuthAccount.findFirst({
      where: {
        userId,
        provider,
      },
    });

    if (!oauthAccount) {
      throw new BadRequestException('OAuth account not found');
    }

    // Check if user has password - don't allow unlinking if it's the only auth method
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
    });

    if (!user?.hashedPassword) {
      const otherAccounts = await this.prisma.client.oAuthAccount.count({
        where: {
          userId,
          NOT: { id: oauthAccount.id },
        },
      });

      if (otherAccounts === 0) {
        throw new BadRequestException(
          'Cannot unlink the only authentication method. Please set a password first.'
        );
      }
    }

    await this.prisma.client.oAuthAccount.delete({
      where: { id: oauthAccount.id },
    });

    return { message: `${provider} account unlinked successfully` };
  }
}
