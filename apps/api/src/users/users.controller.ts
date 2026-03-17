import {
  Body,
  Controller,
  Delete,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { OAuthOnboardingStatusResponse, User } from '@pytholit/contracts';
import { AuthService as NestBetterAuthService } from '@thallesp/nestjs-better-auth';
import type { Request } from 'express';

import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { CompleteOAuthOnboardingDto } from './dto/complete-oauth-onboarding.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UsersService } from './users.service.js';

/**
 * Users Controller
 * Handles user profile management endpoints
 */
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly betterAuthService: NestBetterAuthService,
  ) {}

  @Get('me')
  async getProfile(@CurrentUser('id') userId: string): Promise<User> {
    return this.usersService.getUserProfile(userId);
  }

  @Patch('me')
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<User> {
    return this.usersService.updateProfile(userId, updateUserDto);
  }

  @Get('me/oauth-onboarding')
  async getOAuthOnboarding(
    @CurrentUser('id') userId: string
  ): Promise<OAuthOnboardingStatusResponse> {
    return this.usersService.getOAuthOnboardingState(userId);
  }

  @Patch('me/oauth-onboarding')
  async completeOAuthOnboarding(
    @CurrentUser('id') userId: string,
    @Body() payload: CompleteOAuthOnboardingDto
  ): Promise<User> {
    return this.usersService.completeOAuthOnboarding(userId, payload);
  }

  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @CurrentUser('id') userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 2MB
        ],
      })
    )
    file: Express.Multer.File
  ): Promise<User> {
    return this.usersService.uploadAvatar(userId, file);
  }

  @Delete('me/avatar')
  async deleteAvatar(@CurrentUser('id') userId: string): Promise<User> {
    return this.usersService.deleteAvatar(userId);
  }

  @Post('me/change-password')
  async changePassword(
    @Body()
    body: {
      currentPassword: string;
      newPassword: string;
      revokeOtherSessions?: boolean;
    },
    @Req() req: Request
  ): Promise<{ success: true }> {
    await this.betterAuthService.instance.api.changePassword({
      body: {
        currentPassword: body.currentPassword,
        newPassword: body.newPassword,
        revokeOtherSessions: body.revokeOtherSessions ?? true,
      },
      headers: req.headers,
    });

    return { success: true };
  }

  @Post('me/set-password')
  async setPassword(
    @Body()
    body: {
      newPassword: string;
    },
    @Req() req: Request
  ): Promise<{ success: true }> {
    await this.betterAuthService.instance.api.setPassword({
      body: {
        newPassword: body.newPassword,
      },
      headers: req.headers,
    });

    return { success: true };
  }
}
