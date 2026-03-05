import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { UserProfile } from '@pytholit/contracts';
import { exclude } from '@pytholit/db';
import * as fs from 'fs/promises';
import * as path from 'path';

import { readTrimmedStringOrDefault } from '../config/config-readers';
import { UPLOAD_DIR_DEFAULT } from '../config/defaults';
import { isPrismaUniqueViolation } from '../common/utils/prisma-error.utils';
import { PrismaService } from '../database/prisma.service';
import { CompleteOAuthOnboardingDto } from './dto/complete-oauth-onboarding.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * Users Service
 * Handles user profile operations
 */
@Injectable()
export class UsersService {
  private uploadDir: string;
  private readonly emailPasswordProviderId = 'email-password';

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {
    this.uploadDir = readTrimmedStringOrDefault(this.configService, 'UPLOAD_DIR', UPLOAD_DIR_DEFAULT);
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    const [user, adminMembership] = await Promise.all([
      this.prisma.client.user.findUnique({
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
      }),
      this.prisma.client.admin.findUnique({
        where: { userId },
        select: { level: true },
      }),
    ]);

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
      isAdmin: !!adminMembership,
      adminLevel: adminMembership?.level ?? null,
      novuSubscriberId: userWithoutPassword.novuSubscriberId ?? null,
      createdAt: userWithoutPassword.createdAt.toISOString(),
      updatedAt: userWithoutPassword.updatedAt.toISOString(),
      plan: null,
    };
  }

  async updateProfile(userId: string, updateUserDto: UpdateUserDto): Promise<UserProfile> {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      await this.prisma.client.user.update({
        where: { id: userId },
        data: {
          ...updateUserDto,
        },
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
    const required = !user.username || user.accounts.some(account => account.oauthOnboardingRequired);
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

  async completeOAuthOnboarding(
    userId: string,
    input: CompleteOAuthOnboardingDto
  ): Promise<UserProfile> {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

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

  async uploadAvatar(userId: string, file: Express.Multer.File): Promise<UserProfile> {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Delete old avatar if exists
    if (user.avatarUrl) {
      try {
        const relative = user.avatarUrl.replace(/^\/+/, '');
        const oldPath = path.join(process.cwd(), relative);
        await fs.unlink(oldPath);
      } catch (error) {
        // Ignore if file doesn't exist
      }
    }

    // Create avatars directory if it doesn't exist
    const avatarsDir = path.join(process.cwd(), this.uploadDir, 'avatars');
    await fs.mkdir(avatarsDir, { recursive: true });

    // Generate unique filename
    const fileExtension = path.extname(file.originalname);
    const timestamp = Date.now();
    const filename = `${userId}-${timestamp}${fileExtension}`;
    const filepath = path.join(avatarsDir, filename);

    // Save file
    await fs.writeFile(filepath, file.buffer);

    // Update user avatar URL
    const avatarUrl = `/${this.uploadDir}/avatars/${filename}`;
    await this.prisma.client.user.update({
      where: { id: userId },
      data: { avatarUrl },
    });

    return this.getUserProfile(userId);
  }

  async deleteAvatar(userId: string): Promise<UserProfile> {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.avatarUrl) {
      throw new BadRequestException('No avatar to delete');
    }

    // Delete file
    try {
      const relative = user.avatarUrl.replace(/^\/+/, '');
      const filepath = path.join(process.cwd(), relative);
      await fs.unlink(filepath);
    } catch (error) {
      // Ignore if file doesn't exist
    }

    // Update user
    await this.prisma.client.user.update({
      where: { id: userId },
      data: { avatarUrl: null },
    });

    return this.getUserProfile(userId);
  }
}
