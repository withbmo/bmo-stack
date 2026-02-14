import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AuthService } from '../auth/auth.service';
import type { LoginResponse } from '@pytholit/contracts';

export interface OAuthProfile {
  provider: 'google' | 'github';
  providerId: string;
  email: string;
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
    private readonly authService: AuthService
  ) {}

  async handleOAuthLogin(profile: OAuthProfile): Promise<LoginResponse> {
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
      user = await this.prisma.client.user.findUnique({
        where: { email: profile.email },
      });

      if (user) {
        // Link OAuth account to existing user
        oauthAccount = await this.prisma.client.oAuthAccount.create({
          data: {
            userId: user.id,
            provider: profile.provider,
            accountId: profile.providerId,
            accountEmail: profile.email,
            accessToken: profile.accessToken,
            refreshToken: profile.refreshToken,
          },
          include: {
            user: true,
          },
        });
      } else {
        // Create new user and OAuth account
        // Generate username from email
        const emailLocalPart = profile.email.split('@')[0];
        if (!emailLocalPart) {
          throw new BadRequestException('Invalid email from OAuth provider');
        }
        const username = emailLocalPart.toLowerCase();

        user = await this.prisma.client.user.create({
          data: {
            email: profile.email,
            username,
            fullName: profile.name || null,
            avatarUrl: profile.avatarUrl || null,
            hashedPassword: '', // OAuth users don't have password
            isEmailVerified: true, // Email verified by OAuth provider
          },
        });

        oauthAccount = await this.prisma.client.oAuthAccount.create({
          data: {
            userId: user.id,
            provider: profile.provider,
            accountId: profile.providerId,
            accountEmail: profile.email,
            accessToken: profile.accessToken,
            refreshToken: profile.refreshToken,
          },
          include: {
            user: true,
          },
        });
      }
    } else {
      // Update OAuth tokens
      await this.prisma.client.oAuthAccount.update({
        where: { id: oauthAccount.id },
        data: {
          accessToken: profile.accessToken,
          refreshToken: profile.refreshToken,
        },
      });
    }

    if (!user) {
      throw new BadRequestException('User creation failed');
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
