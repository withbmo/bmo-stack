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

import { PrismaService } from '../database/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * Users Service
 * Handles user profile operations
 */
@Injectable()
export class UsersService {
  private uploadDir: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {
    this.uploadDir = this.configService.get<string>('UPLOAD_DIR') || 'uploads';
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userWithoutPassword = exclude(user, ['hashedPassword']);

    return {
      id: userWithoutPassword.id,
      email: userWithoutPassword.email,
      username: userWithoutPassword.username,
      fullName: userWithoutPassword.fullName,
      firstName: userWithoutPassword.firstName ?? null,
      lastName: userWithoutPassword.lastName ?? null,
      bio: userWithoutPassword.bio,
      avatarUrl: userWithoutPassword.avatarUrl,
      isEmailVerified: userWithoutPassword.isEmailVerified,
      isActive: userWithoutPassword.isActive,
      isSuperuser: userWithoutPassword.isSuperuser,
      role: userWithoutPassword.role,
      permissions: userWithoutPassword.permissions,
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

    // Check if email is being changed and already exists
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.prisma.client.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
    }

    await this.prisma.client.user.update({
      where: { id: userId },
      data: {
        ...updateUserDto,
        // Reset email verification if email changed
        ...(updateUserDto.email && updateUserDto.email !== user.email
          ? { isEmailVerified: false }
          : {}),
      },
    });

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
