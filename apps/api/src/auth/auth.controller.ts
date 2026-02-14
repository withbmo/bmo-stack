import { Body, Controller, Get, HttpCode, HttpStatus,Post } from '@nestjs/common';
import type { LoginResponse } from '@pytholit/contracts';
import { LoginDto, ResetPasswordDto,SignupDto } from '@pytholit/validation/class-validator';

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
  async signup(@Body() signupDto: SignupDto): Promise<LoginResponse> {
    return this.authService.signup(signupDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('me')
  async getProfile(@CurrentUser() user: any) {
    // Protected route - requires JWT token
    return user;
  }
}
