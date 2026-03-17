import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { User } from '@pytholit/contracts';
import { exclude } from '@pytholit/db';

import { isPrismaUniqueViolation } from '../common/utils/prisma-error.utils.js';
import { PrismaService } from '../database/prisma.service.js';
import { validateAndProcessAvatar } from '../storage/image.utils.js';
import { StorageService } from '../storage/storage.service.js';
import { CompleteOAuthOnboardingDto } from './dto/complete-oauth-onboarding.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
  private readonly emailPasswordProviderId = 'email-password';

  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService
  ) {}

  async getUserProfile(userId: string): Promise<User> {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
      include: {
        accounts: {
          where: { providerId: { not: this.emailPasswordProviderId } },
          select: {
            oauthOnboardingRequired: true,
            oauthOnboardingCompletedAt: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userWithoutPassword = exclude(user, ['hashedPassword']);

    const oauthOnboardingRequired =
      !userWithoutPassword.username ||
      userWithoutPassword.accounts.some(account => account.oauthOnboardingRequired);
    const oauthCompletedAt =
      userWithoutPassword.accounts
        .map(account => account.oauthOnboardingCompletedAt)
        .filter((value): value is Date => value instanceof Date)
        .sort((a, b) => b.getTime() - a.getTime())[0] ?? null;

    return {
      id: userWithoutPassword.id,
      email: userWithoutPassword.email,
      username: userWithoutPassword.username ?? '',
      firstName: userWithoutPassword.firstName ?? null,
      lastName: userWithoutPassword.lastName ?? null,
      bio: userWithoutPassword.bio,
      avatarUrl: userWithoutPassword.avatarUrl,
      isEmailVerified: userWithoutPassword.isEmailVerified,
      isActive: userWithoutPassword.isActive,
      oauthOnboardingRequired,
      oauthOnboardingCompletedAt: oauthCompletedAt ? oauthCompletedAt.toISOString() : null,
      createdAt: userWithoutPassword.createdAt.toISOString(),
      updatedAt: userWithoutPassword.updatedAt.toISOString(),
      plan: null,
    };
  }

  async updateProfile(userId: string, dto: UpdateUserDto): Promise<User> {
    try {
      await this.prisma.client.user.update({
        where: { id: userId },
        data: { ...dto },
        select: { id: true },
      });
    } catch (err) {
      if (isPrismaUniqueViolation(err)) {
        throw new ConflictException('Username already exists');
      }
      throw err;
    }

    return this.getUserProfile(userId);
  }

  async getOAuthOnboardingState(
    userId: string
  ): Promise<{ required: boolean; completedAt: string | null }> {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        accounts: {
          where: { providerId: { not: this.emailPasswordProviderId } },
          select: {
            oauthOnboardingRequired: true,
            oauthOnboardingCompletedAt: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const required =
      !user.username || user.accounts.some(account => account.oauthOnboardingRequired);
    const completedAt =
      user.accounts
        .map(account => account.oauthOnboardingCompletedAt)
        .filter((value): value is Date => value instanceof Date)
        .sort((a, b) => b.getTime() - a.getTime())[0] ?? null;

    return {
      required,
      completedAt: completedAt ? completedAt.toISOString() : null,
    };
  }

  async completeOAuthOnboarding(userId: string, input: CompleteOAuthOnboardingDto): Promise<User> {
    try {
      await this.prisma.client.user.update({
        where: { id: userId },
        data: {
          username: input.username.trim(),
          firstName: input.firstName.trim(),
          lastName: input.lastName.trim(),
          bio: typeof input.bio === 'string' ? input.bio.trim() || null : null,
          accounts: {
            updateMany: {
              where: { providerId: { not: this.emailPasswordProviderId } },
              data: {
                oauthOnboardingRequired: false,
                oauthOnboardingCompletedAt: new Date(),
              },
            },
          },
        },
        select: { id: true },
      });
    } catch (err) {
      if (isPrismaUniqueViolation(err)) {
        throw new ConflictException('Username already exists');
      }
      throw err;
    }

    return this.getUserProfile(userId);
  }

  async uploadAvatar(userId: string, file: Express.Multer.File): Promise<User> {
    const processed = await validateAndProcessAvatar(file.buffer);
    const key = `avatars/${userId}.webp`;
    const { publicUrl } = await this.storage.uploadFile(key, processed, 'image/webp');

    await this.prisma.client.user.update({
      where: { id: userId },
      data: { avatarUrl: publicUrl },
      select: { id: true },
    });

    return this.getUserProfile(userId);
  }

  async deleteAvatar(userId: string): Promise<User> {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
      select: { id: true, avatarUrl: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.avatarUrl) {
      throw new BadRequestException('No avatar to delete');
    }

    await this.storage.deleteFile(`avatars/${userId}.webp`);

    await this.prisma.client.user.update({
      where: { id: userId },
      data: { avatarUrl: null },
      select: { id: true },
    });

    return this.getUserProfile(userId);
  }
}
