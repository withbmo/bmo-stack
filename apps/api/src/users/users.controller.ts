import {
  Body,
  Controller,
  Delete,
	FileTypeValidator,
  Get,
	MaxFileSizeValidator,
	ParseFilePipe,
  Patch,
  Post,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { UserProfile } from '@pytholit/contracts';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

/**
 * Users Controller
 * Handles user profile management endpoints
 */
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@CurrentUser() user: any): Promise<UserProfile> {
    return this.usersService.getUserProfile(user.id);
  }

  @Patch('me')
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserProfile> {
    return this.usersService.updateProfile(user.id, updateUserDto);
  }

  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @CurrentUser() user: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }), // 2MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
      })
    )
    file: Express.Multer.File
  ): Promise<UserProfile> {
    return this.usersService.uploadAvatar(user.id, file);
  }

  @Delete('me/avatar')
  async deleteAvatar(@CurrentUser() user: any): Promise<UserProfile> {
    return this.usersService.deleteAvatar(user.id);
  }
}
