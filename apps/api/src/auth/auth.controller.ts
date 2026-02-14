import { Body, Controller, Post, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto, ResetPasswordDto } from '@pytholit/validation/class-validator';
import type { LoginResponse } from '@pytholit/contracts';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';

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
