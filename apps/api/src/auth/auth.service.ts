import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { LoginResponse } from '@pytholit/contracts';
import { exclude } from '@pytholit/db';
import type { LoginDto, ResetPasswordDto,SignupDto } from '@pytholit/validation/class-validator';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { TurnstileService } from '../common/services/turnstile.service';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly turnstileService: TurnstileService
  ) {}

  private isLocalhostEnv(): boolean {
    return (this.configService.get<string>('APP_ENV') ?? '') === 'localhost';
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  generateAccessToken(userId: string): string {
    const payload = { sub: userId };
    return this.jwtService.sign(payload);
  }

  async signup(dto: SignupDto): Promise<LoginResponse> {
    // Verify Turnstile token FIRST (fail fast before DB queries)
    const isValidToken = await this.turnstileService.verifyToken(dto.captchaToken);
    if (!isValidToken && !this.turnstileService.isDevelopmentMode()) {
      throw new BadRequestException('Invalid security check. Please try again.');
    }

    const existingUser = await this.prisma.client.user.findFirst({
      where: {
        OR: [{ email: dto.email }, { username: dto.username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === dto.email) {
        throw new ConflictException('Email already registered');
      }
      throw new ConflictException('Username already taken');
    }

    const hashedPassword = await this.hashPassword(dto.password);

    const isEmailVerified = this.isLocalhostEnv() ? true : false;
    const user = await this.prisma.client.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        fullName: dto.fullName,
        hashedPassword,
        isEmailVerified,
      },
    });

    const accessToken = this.generateAccessToken(user.id);

    return {
      accessToken,
      tokenType: 'bearer',
      expiresIn: 3600,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        firstName: user.firstName ?? null,
        lastName: user.lastName ?? null,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }

  async login(dto: LoginDto): Promise<LoginResponse> {
    // Verify Turnstile token FIRST
    const isValidToken = await this.turnstileService.verifyToken(dto.captchaToken);
    if (!isValidToken && !this.turnstileService.isDevelopmentMode()) {
      throw new BadRequestException('Invalid security check. Please try again.');
    }

    const user = await this.prisma.client.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.hashedPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.verifyPassword(dto.password, user.hashedPassword);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    if (!user.isEmailVerified && !this.isLocalhostEnv()) {
      throw new ForbiddenException('Email verification required');
    }

    const accessToken = this.generateAccessToken(user.id);

    return {
      accessToken,
      tokenType: 'bearer',
      expiresIn: 3600,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        firstName: user.firstName ?? null,
        lastName: user.lastName ?? null,
        isEmailVerified: user.isEmailVerified,
      },
    };
  }

  async validateUser(userId: string) {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.isActive) {
      return null;
    }

    return exclude(user, ['hashedPassword']);
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const tokenHash = crypto.createHash('sha256').update(dto.token).digest('hex');

    const resetRecord = await this.prisma.client.otp.findFirst({
      where: {
        purpose: 'password_reset',
        idempotencyKey: tokenHash,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!resetRecord) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const user = await this.prisma.client.user.findUnique({
      where: { id: resetRecord.userId },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await this.hashPassword(dto.newPassword);

    await this.prisma.client.$transaction([
      this.prisma.client.user.update({
        where: { id: user.id },
        data: { hashedPassword },
      }),
      // Invalidate reset token (single-use)
      this.prisma.client.otp.update({
        where: { id: resetRecord.id },
        data: {
          idempotencyKey: null,
          expiresAt: new Date(),
        },
      }),
    ]);

    return { message: 'Password reset successfully' };
  }
}
