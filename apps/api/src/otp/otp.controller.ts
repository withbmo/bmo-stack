import { Body, Controller, HttpCode, HttpStatus,Post, Res } from '@nestjs/common';
import type { OTPVerifyResponse } from '@pytholit/contracts';
import type { Response } from 'express';

import { setAuthCookie } from '../auth/auth.cookies';
import { Public } from '../auth/decorators/public.decorator';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { OtpService } from './otp.service';

/**
 * OTP Controller
 * Handles OTP sending and verification endpoints
 */
@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Public()
  @Post('send')
  @HttpCode(HttpStatus.OK)
  async send(
    @Body() sendOtpDto: SendOtpDto
  ): Promise<{ message: string; expiresIn: number }> {
    return this.otpService.sendOtp(
      sendOtpDto.email,
      sendOtpDto.purpose,
      sendOtpDto.captchaToken
    );
  }

  @Public()
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verify(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<OTPVerifyResponse> {
    const result = await this.otpService.verifyOtp(
      verifyOtpDto.email,
      verifyOtpDto.code,
      verifyOtpDto.purpose
    );
    if (result.success && result.token) {
      setAuthCookie(res, result.token);
    }
    return result;
  }

  @Public()
  @Post('resend')
  @HttpCode(HttpStatus.OK)
  async resend(
    @Body() body: { email: string; purpose: string }
  ): Promise<{ message: string; expiresIn: number }> {
    return this.otpService.resendOtp(body.email, body.purpose as any);
  }
}
