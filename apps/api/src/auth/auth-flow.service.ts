import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { type Auth, AuthService as NestBetterAuthService } from '@thallesp/nestjs-better-auth';
import { randomUUID } from 'crypto';

import { TurnstileService } from '../common/services/turnstile.service';
import { PrismaService } from '../database/prisma.service';
import { EmailService } from '../email/email.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginPasswordDto } from './dto/login-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { SignupPasswordDto } from './dto/signup-password.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

const OTP_PURPOSE = 'email_verification' as const;
const OTP_TYPE = 'email-verification' as const;
const OTP_TTL_SECONDS = 10 * 60;
const OTP_COOLDOWN_SECONDS = 60;
const OTP_HOURLY_LIMIT = 5;
const OTP_DAILY_LIMIT = 10;
const OTP_VERIFY_HOURLY_LIMIT = 10;
const OTP_LOCK_MINUTES = 15;

export type AuthFlowOtpRequired = {
  status: 'otp_required';
  otpExpiresAt: string;
  nextRequestAt: string;
  setCookies?: string[];
};

export type AuthFlowAuthenticated = {
  status: 'authenticated';
  setCookies?: string[];
};

@Injectable()
export class AuthFlowService {
  private readonly logger = new Logger(AuthFlowService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly turnstileService: TurnstileService,
    private readonly emailService: EmailService,
    private readonly betterAuthService: NestBetterAuthService<Auth>
  ) {}

  async signupPassword(
    dto: SignupPasswordDto,
    requestHeaders: Headers,
    ip?: string,
    userAgent?: string
  ): Promise<AuthFlowOtpRequired> {
    const email = this.normalizeEmail(dto.email);
    void userAgent;
    await this.verifyCaptcha(dto.captchaToken, ip);

    await this.ensureLocalProfile({
      email,
      username: dto.username,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    const auth = this.betterAuthService.instance;
    const name = [dto.firstName, dto.lastName].filter(Boolean).join(' ').trim();

    try {
      await (auth.api as any).signUpEmail({
        body: {
          email,
          password: dto.password,
          name: name || email,
        },
        headers: requestHeaders,
      });
    } catch (error) {
      if (!this.isAlreadyExistsError(error)) {
        throw this.mapAuthError(error);
      }
    }

    const otpState = await this.issueVerificationOtp(email, requestHeaders, ip);
    this.logger.log(`auth.signup.created email=${email}`);

    return {
      status: 'otp_required',
      otpExpiresAt: otpState.expiresAt,
      nextRequestAt: otpState.nextRequestAt,
    };
  }

  async loginPassword(
    dto: LoginPasswordDto,
    requestHeaders: Headers,
    ip?: string,
    userAgent?: string
  ): Promise<AuthFlowAuthenticated | AuthFlowOtpRequired> {
    const email = this.normalizeEmail(dto.email);
    await this.verifyCaptcha(dto.captchaToken, ip);

    const auth = this.betterAuthService.instance;

    try {
      const signInResponse: Response = await (auth.api as any).signInEmail({
        body: {
          email,
          password: dto.password,
          rememberMe: true,
        },
        headers: requestHeaders,
        asResponse: true,
      });
      await signInResponse.json();
      this.logger.log(`auth.login.success email=${email}`);
      return { status: 'authenticated', setCookies: this.extractSetCookies(signInResponse) };
    } catch (error) {
      const unverified = this.isEmailUnverifiedError(error);
      if (!unverified) {
        this.logger.warn(`auth.login.failed email=${email}`);
        throw this.mapAuthError(error);
      }

      const otpState = await this.issueVerificationOtp(email, requestHeaders, ip, userAgent);
      this.logger.log(`auth.login.requires_otp email=${email}`);

      return {
        status: 'otp_required',
        otpExpiresAt: otpState.expiresAt,
        nextRequestAt: otpState.nextRequestAt,
      };
    }
  }

  async sendOtp(
    dto: SendOtpDto,
    requestHeaders: Headers,
    ip?: string,
    userAgent?: string
  ): Promise<{ status: 'sent'; otpExpiresAt: string; nextRequestAt: string }> {
    const email = this.normalizeEmail(dto.email);
    if (dto.purpose !== OTP_PURPOSE) {
      throw new BadRequestException({ code: 'AUTH_OTP_PURPOSE_INVALID', detail: 'Unsupported OTP purpose.' });
    }
    await this.verifyCaptcha(dto.captchaToken, ip);

    const otpState = await this.issueVerificationOtp(email, requestHeaders, ip, userAgent);
    this.logger.log(`auth.otp.sent email=${email}`);

    return {
      status: 'sent',
      otpExpiresAt: otpState.expiresAt,
      nextRequestAt: otpState.nextRequestAt,
    };
  }

  async verifyOtp(
    dto: VerifyOtpDto,
    requestHeaders: Headers,
    ip?: string
  ): Promise<AuthFlowAuthenticated> {
    const email = this.normalizeEmail(dto.email);
    const ipKey = this.normalizeIp(ip);
    if (dto.purpose !== OTP_PURPOSE) {
      throw new BadRequestException({ code: 'AUTH_OTP_PURPOSE_INVALID', detail: 'Unsupported OTP purpose.' });
    }

    await this.enforceThrottleWindow(email, ipKey, 'verify_hourly', 3600, OTP_VERIFY_HOURLY_LIMIT);

    const auth = this.betterAuthService.instance;
    let verifyResponse: Response | null = null;
    try {
      const response = await (auth.api as any).verifyEmailOTP({
        body: {
          email,
          otp: dto.code,
        },
        headers: requestHeaders,
        asResponse: true,
      });
      if (!response) {
        throw new Error('OTP verification did not return a response');
      }
      verifyResponse = response as Response;
      await verifyResponse.json();
    } catch (error) {
      this.logger.warn(`auth.otp.verify.failed email=${email}`);
      throw this.mapOtpVerificationError(error);
    }

    await this.prisma.client.user.updateMany({
      where: { email },
      data: { isEmailVerified: true },
    });

    this.logger.log(`auth.otp.verify.success email=${email}`);
    return { status: 'authenticated', setCookies: this.extractSetCookies(verifyResponse as Response) };
  }

  async forgotPassword(dto: ForgotPasswordDto, requestHeaders: Headers): Promise<{ status: boolean; message: string }> {
    const auth = this.betterAuthService.instance;
    try {
      return await (auth.api as any).requestPasswordReset({
        body: {
          email: this.normalizeEmail(dto.email),
          redirectTo: dto.redirectTo,
        },
        headers: requestHeaders,
      });
    } catch (error) {
      throw this.mapAuthError(error);
    }
  }

  async resetPassword(dto: ResetPasswordDto, requestHeaders: Headers): Promise<{ status: boolean }> {
    const auth = this.betterAuthService.instance;
    try {
      return await (auth.api as any).resetPassword({
        body: {
          token: dto.token,
          newPassword: dto.newPassword,
        },
        headers: requestHeaders,
      });
    } catch (error) {
      throw this.mapAuthError(error);
    }
  }

  private async issueVerificationOtp(
    email: string,
    requestHeaders: Headers,
    ip?: string,
    userAgent?: string
  ): Promise<{ expiresAt: string; nextRequestAt: string }> {
    void userAgent;
    const ipKey = this.normalizeIp(ip);
    await this.enforceSendLimits(email, ipKey);

    const auth = this.betterAuthService.instance;
    const otp = await (auth.api as any).createVerificationOTP({
      body: {
        email,
        type: OTP_TYPE,
      },
      headers: requestHeaders,
    });

    const expiresAt = new Date(Date.now() + OTP_TTL_SECONDS * 1000);
    const nextRequestAt = new Date(Date.now() + OTP_COOLDOWN_SECONDS * 1000);

    const toName = this.deriveNameFromEmail(email);
    await this.emailService.sendOtpVerificationEmail({
      toEmail: email,
      toName,
      code: otp,
      expiresInMinutes: OTP_TTL_SECONDS / 60,
    });

    return {
      expiresAt: expiresAt.toISOString(),
      nextRequestAt: nextRequestAt.toISOString(),
    };
  }

  private async enforceSendLimits(email: string, ip: string): Promise<void> {
    await this.enforceThrottleWindow(email, ip, 'send_hourly', 3600, OTP_HOURLY_LIMIT);
    await this.enforceThrottleWindow(email, ip, 'send_daily', 86400, OTP_DAILY_LIMIT);
    await this.enforceSendCooldown(email, ip);
  }

  private async enforceThrottleWindow(
    email: string,
    ip: string,
    action: string,
    windowSec: number,
    maxAttempts: number
  ): Promise<void> {
    const now = new Date();
    const windowMs = windowSec * 1000;
    const windowStart = new Date(Math.floor(now.getTime() / windowMs) * windowMs);
    const lockUntil = new Date(now.getTime() + OTP_LOCK_MINUTES * 60 * 1000);

    const lockedRows = await this.prisma.client.$queryRawUnsafe<Array<{ lockedUntil: Date }>>(
      `SELECT "locked_until" as "lockedUntil"
       FROM "auth_otp_throttles"
       WHERE "email" = $1 AND "ip" = $2 AND "action" = $3 AND "locked_until" > NOW()
       ORDER BY "locked_until" DESC
       LIMIT 1`,
      email,
      ip,
      action
    );

    if (lockedRows.length > 0) {
      const lockedUntil = lockedRows[0]?.lockedUntil ?? lockUntil;
      this.throwRateLimited(
        'AUTH_OTP_LOCKED',
        `Too many OTP attempts. Try again after ${lockedUntil.toISOString()}.`
      );
    }

    const rows = await this.prisma.client.$queryRawUnsafe<Array<{ attempts: number }>>(
      `INSERT INTO "auth_otp_throttles"
          ("id", "email", "ip", "action", "window_start", "window_sec", "attempts", "locked_until", "created_at", "updated_at")
       VALUES ($1, $2, $3, $4, $5, $6, 1, NULL, NOW(), NOW())
       ON CONFLICT ("email", "ip", "action", "window_start", "window_sec")
       DO UPDATE SET "attempts" = "auth_otp_throttles"."attempts" + 1, "updated_at" = NOW()
       RETURNING "attempts"`,
      randomUUID(),
      email,
      ip,
      action,
      windowStart,
      windowSec
    );

    const attempts = Number(rows[0]?.attempts ?? 0);
    if (attempts > maxAttempts) {
      await this.prisma.client.$executeRawUnsafe(
        `UPDATE "auth_otp_throttles"
         SET "locked_until" = $1, "updated_at" = NOW()
         WHERE "email" = $2 AND "ip" = $3 AND "action" = $4 AND "window_start" = $5 AND "window_sec" = $6`,
        lockUntil,
        email,
        ip,
        action,
        windowStart,
        windowSec
      );
      this.logger.warn(`auth.otp.locked email=${email} ip=${ip} action=${action} attempts=${attempts}`);
      this.throwRateLimited(
        'AUTH_OTP_LOCKED',
        `Too many OTP attempts. Try again after ${lockUntil.toISOString()}.`
      );
    }
  }

  private async enforceSendCooldown(email: string, ip: string): Promise<void> {
    const now = Date.now();
    const windowMs = OTP_COOLDOWN_SECONDS * 1000;
    const windowStart = new Date(Math.floor(now / windowMs) * windowMs);

    const rows = await this.prisma.client.$queryRawUnsafe<Array<{ attempts: number }>>(
      `INSERT INTO "auth_otp_throttles"
          ("id", "email", "ip", "action", "window_start", "window_sec", "attempts", "locked_until", "created_at", "updated_at")
       VALUES ($1, $2, $3, 'send_cooldown', $4, $5, 1, NULL, NOW(), NOW())
       ON CONFLICT ("email", "ip", "action", "window_start", "window_sec")
       DO UPDATE SET "attempts" = "auth_otp_throttles"."attempts" + 1, "updated_at" = NOW()
       RETURNING "attempts"`,
      randomUUID(),
      email,
      ip,
      windowStart,
      OTP_COOLDOWN_SECONDS
    );

    const attempts = Number(rows[0]?.attempts ?? 0);
    if (attempts > 1) {
      const retryAt = new Date(windowStart.getTime() + OTP_COOLDOWN_SECONDS * 1000).toISOString();
      this.throwRateLimited('AUTH_OTP_COOLDOWN', `OTP already sent. Try again after ${retryAt}.`);
    }
  }

  private deriveNameFromEmail(email: string): string {
    const local = email.split('@')[0]?.trim() || 'there';
    return local.replace(/[._-]/g, ' ').slice(0, 40) || 'there';
  }

  private normalizeIp(ip?: string): string {
    const raw = (ip ?? '').trim();
    if (!raw) return 'unknown';
    return raw.slice(0, 120);
  }

  private async ensureLocalProfile(input: {
    email: string;
    username: string;
    firstName: string;
    lastName?: string;
  }): Promise<void> {
    const existing = await this.prisma.client.user.findUnique({ where: { email: input.email } });
    if (existing) {
      await this.prisma.client.user.update({
        where: { email: input.email },
        data: {
          firstName: input.firstName.trim(),
          lastName: input.lastName?.trim() || null,
        },
      });
      return;
    }

    const username = await this.ensureUniqueUsername(input.username, input.email);
    await this.prisma.client.user.create({
      data: {
        email: input.email,
        username,
        firstName: input.firstName.trim(),
        lastName: input.lastName?.trim() || null,
        isEmailVerified: false,
        isActive: true,
      },
    });
  }

  private async ensureUniqueUsername(desired: string, email: string): Promise<string> {
    const base = desired.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 30) || email.split('@')[0] || 'user';
    let candidate = base;
    let idx = 0;
    while (idx < 30) {
      const found = await this.prisma.client.user.findUnique({ where: { username: candidate } });
      if (!found) return candidate;
      idx += 1;
      const suffix = String(idx);
      candidate = `${base.slice(0, Math.max(1, 30 - suffix.length - 1))}_${suffix}`;
    }
    return `${base.slice(0, 24)}_${Date.now().toString().slice(-5)}`;
  }

  private normalizeEmail(value: string): string {
    return value.trim().toLowerCase();
  }

  private async verifyCaptcha(token: string, ip?: string): Promise<void> {
    if (this.turnstileService.isDevelopmentMode()) {
      return;
    }

    const valid = await this.turnstileService.verifyToken(token, ip);
    if (!valid) {
      throw new BadRequestException({ code: 'AUTH_CAPTCHA_INVALID', detail: 'Invalid CAPTCHA token.' });
    }
  }

  private isAlreadyExistsError(error: unknown): boolean {
    const message = JSON.stringify(error ?? '').toLowerCase();
    return message.includes('already') && (message.includes('user') || message.includes('email'));
  }

  private isEmailUnverifiedError(error: unknown): boolean {
    const message = JSON.stringify(error ?? '').toLowerCase();
    return message.includes('verify') && message.includes('email');
  }

  private mapAuthError(error: unknown): never {
    if (error && typeof error === 'object' && 'status' in (error as Record<string, unknown>)) {
      throw error;
    }

    const message = error instanceof Error ? error.message : 'Authentication request failed.';
    if (message.toLowerCase().includes('too many')) {
      this.throwRateLimited('AUTH_RATE_LIMITED', message);
    }
    throw new BadRequestException({ code: 'AUTH_REQUEST_FAILED', detail: message });
  }

  private mapOtpVerificationError(error: unknown): never {
    const message = JSON.stringify(error ?? '').toLowerCase();
    if (message.includes('too many') || message.includes('attempt')) {
      this.throwRateLimited(
        'AUTH_OTP_ATTEMPTS_EXCEEDED',
        'Too many invalid OTP attempts. Request a new code.'
      );
    }
    if (message.includes('expired') || message.includes('not found')) {
      throw new BadRequestException({
        code: 'AUTH_OTP_EXPIRED',
        detail: 'The OTP code has expired. Request a new code.',
      });
    }
    if (message.includes('invalid') || message.includes('incorrect') || message.includes('otp')) {
      throw new UnauthorizedException({ code: 'AUTH_OTP_INVALID', detail: 'Invalid OTP code.' });
    }
    throw this.mapAuthError(error);
  }

  private extractSetCookies(response: Response): string[] {
    const headers = response.headers as Headers & { getSetCookie?: () => string[] };
    if (typeof headers.getSetCookie === 'function') {
      return headers.getSetCookie();
    }
    const single = response.headers.get('set-cookie');
    return single ? [single] : [];
  }

  private throwRateLimited(code: string, detail: string): never {
    throw new HttpException({ code, detail }, HttpStatus.TOO_MANY_REQUESTS);
  }
}
