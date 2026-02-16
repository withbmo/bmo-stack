import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { OTPPurpose } from '@pytholit/contracts';
import * as crypto from 'crypto';

import { TurnstileService } from '../common/services/turnstile.service';
import { PrismaService } from '../database/prisma.service';
import { EmailService } from '../email/email.service';

/**
 * OTP Service
 * Handles one-time password generation, storage, and verification
 */
@Injectable()
export class OtpService {
  private readonly otpExpiryMinutes: number;
  private readonly otpLength: number;
  private readonly passwordResetTokenExpiryMinutes: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly turnstileService: TurnstileService
  ) {
    this.otpExpiryMinutes = this.configService.get<number>('OTP_EXPIRY_MINUTES') || 15;
    this.otpLength = this.configService.get<number>('OTP_LENGTH') || 6;
    this.passwordResetTokenExpiryMinutes =
      this.configService.get<number>('PASSWORD_RESET_TOKEN_EXPIRY_MINUTES') || 30;
  }

  private generateAccessToken(userId: string): string {
    return this.jwtService.sign({ sub: userId });
  }

  /**
   * Generate a random OTP code
   */
  private generateOtpCode(): string {
    const digits = '0123456789';
    let code = '';
    for (let i = 0; i < this.otpLength; i++) {
      code += digits[Math.floor(Math.random() * digits.length)];
    }
    return code;
  }

  /**
   * Hash OTP code for secure storage
   */
  private hashOtp(code: string): string {
    return crypto.createHash('sha256').update(code).digest('hex');
  }

  /**
   * Send OTP to user's email
   */
  async sendOtp(
    email: string,
    purpose: OTPPurpose,
    captchaToken?: string
  ): Promise<{ message: string; expiresIn: number }> {
    // Verify captcha if provided
    if (captchaToken) {
      const isValid = await this.turnstileService.verifyToken(captchaToken);
      if (!isValid && !this.turnstileService.isDevelopmentMode()) {
        throw new BadRequestException('Invalid captcha token');
      }
    }

    const user = await this.prisma.client.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not
      return {
        message: 'If the email exists, an OTP has been sent',
        expiresIn: this.otpExpiryMinutes * 60,
      };
    }

    // Generate OTP code
    const code = this.generateOtpCode();
    const codeHash = this.hashOtp(code);
    const expiresAt = new Date(Date.now() + this.otpExpiryMinutes * 60 * 1000);

    // Invalidate any existing OTPs for this user and purpose
    await this.prisma.client.otp.updateMany({
      where: {
        userId: user.id,
        purpose,
        isUsed: false,
      },
      data: {
        isUsed: true,
      },
    });

    // Create new OTP
    await this.prisma.client.otp.create({
      data: {
        userId: user.id,
        codeHash,
        purpose,
        expiresAt,
        isUsed: false,
      },
    });

    // Send email with OTP code
    try {
      await this.emailService.sendOtpEmail({
        toEmail: email,
        toName: email.split('@')[0] ?? email,
        otpCode: code,
        purpose,
        expiryMinutes: this.otpExpiryMinutes,
      });

      // Email sent successfully
      return {
        message: 'OTP sent successfully to your email',
        expiresIn: this.otpExpiryMinutes * 60,
      };
    } catch (error) {
      // Email failed but OTP is saved - user can resend
      // Following best practices: save OTP first, allow retry
      console.error('Failed to send OTP email but OTP was created', {
        userId: user.id,
        email,
        purpose,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      // Return helpful error message
      return {
        message: 'OTP created but email delivery failed. You can request a resend in 60 seconds.',
        expiresIn: this.otpExpiryMinutes * 60,
      };
    }
  }

  /**
   * Verify OTP code
   */
  async verifyOtp(
    email: string,
    code: string,
    purpose: OTPPurpose
  ): Promise<{ success: boolean; token?: string }> {
    const user = await this.prisma.client.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    const codeHash = this.hashOtp(code);

    // Find valid OTP
    const otp = await this.prisma.client.otp.findFirst({
      where: {
        userId: user.id,
        codeHash,
        purpose,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!otp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    // Mark OTP as used
    await this.prisma.client.otp.update({
      where: { id: otp.id },
      data: { isUsed: true },
    });

    // For email verification, update user
    if (purpose === 'email_verification') {
      await this.prisma.client.user.updateMany({
        where: { email },
        data: { isEmailVerified: true },
      });

      // Send email verified notification
      try {
        await this.emailService.sendEmailVerifiedNotification({
          toEmail: email,
          toName: email.split('@')[0] ?? email,
        });
      } catch (error) {
        // Log but don't fail - notification is not critical
        console.error(
          'Failed to send email verified notification:',
          error instanceof Error ? error.message : error
        );
      }
    }

    // Generate verification token for password reset
    let token: string | undefined;
    if (purpose === 'password_reset') {
      token = crypto.randomBytes(32).toString('hex');
      const tokenHash = this.hashOtp(token);
      const expiresAt = new Date(Date.now() + this.passwordResetTokenExpiryMinutes * 60 * 1000);
      // Persist reset token hash on the used OTP record.
      // We use `idempotencyKey` as a single-use token hash store.
      await this.prisma.client.otp.update({
        where: { id: otp.id },
        data: {
          idempotencyKey: tokenHash,
          expiresAt,
        },
      });
    } else if (
      purpose === 'email_verification' ||
      purpose === 'login_verification' ||
      purpose === '2fa'
    ) {
      token = this.generateAccessToken(user.id);
    }

    return {
      success: true,
      token,
    };
  }

  /**
   * Resend OTP (with rate limiting)
   */
  async resendOtp(
    email: string,
    purpose: OTPPurpose
  ): Promise<{ message: string; expiresIn: number }> {
    const user = await this.prisma.client.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not
      return {
        message: 'If the email exists, an OTP has been sent',
        expiresIn: this.otpExpiryMinutes * 60,
      };
    }

    // Check rate limiting - prevent spam
    const recentOtp = await this.prisma.client.otp.findFirst({
      where: {
        userId: user.id,
        purpose,
        createdAt: {
          gt: new Date(Date.now() - 60 * 1000), // Within last minute
        },
      },
    });

    if (recentOtp) {
      throw new BadRequestException('Please wait before requesting another OTP');
    }

    return this.sendOtp(email, purpose);
  }

  /**
   * Clean up expired OTPs (should be run periodically)
   */
  async cleanupExpiredOtps(): Promise<number> {
    const result = await this.prisma.client.otp.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return result.count;
  }
}
