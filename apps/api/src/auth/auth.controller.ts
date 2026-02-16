import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import type { LoginResponse } from '@pytholit/contracts';
import { LoginDto, ResetPasswordDto, SignupDto } from '@pytholit/validation/class-validator';
import type { Response } from 'express';

import { clearAuthCookie, setAuthCookie } from './auth.cookies';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';

/**
 * Auth Controller
 * Handles authentication endpoints with shared validation
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(
    @Body() signupDto: SignupDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<LoginResponse> {
    const result = await this.authService.signup(signupDto);
    setAuthCookie(res, result.accessToken);
    return result;
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<LoginResponse> {
    const result = await this.authService.login(loginDto);
    setAuthCookie(res, result.accessToken);
    return result;
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response): Promise<{ message: string }> {
    clearAuthCookie(res);
    return { message: 'Logged out' };
  }

  @Get('me')
  async getProfile(@CurrentUser() user: any) {
    // Protected route - requires JWT token
    return user;
  }
}
