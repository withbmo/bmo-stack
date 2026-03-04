import { Global, Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule as NestBetterAuthModule } from '@thallesp/nestjs-better-auth';

import { BillingModule } from '../billing/billing.module';
import { TurnstileService } from '../common/services/turnstile.service';
import { PrismaService } from '../database/prisma.service';
import { EmailModule } from '../email/email.module';
import { EmailService } from '../email/email.service';
import { getJwtExpiresIn, getJwtSecret } from './auth.config';
import { AuthController } from './auth.controller';
import { createBetterAuth } from './better-auth.config';
import { BetterAuthApiErrorFilter } from './filters/better-auth-api-error.filter';
import { BetterAuthGuard } from './guards/better-auth.guard';
import { AuthEventsHook } from './hooks/auth-events.hook';
import { EmailVerificationCooldownHook } from './hooks/email-verification-cooldown.hook';
import { LoginLockoutHook } from './hooks/login-lockout.hook';

/**
 * Authentication module for the Pytholit API.
 *
 * This module integrates **Better Auth** for modern, secure authentication and
 * provides a NestJS-compatible wrapper for session management, OAuth, and
 * email/password authentication.
 *
 * **Features:**
 * - Session-based authentication with secure cookies
 * - OAuth providers (Google, GitHub)
 * - Email/password authentication
 * - JWT tokens for custom operations
 * - Rate limiting protection on auth endpoints
 *
 * **Architecture:**
 * - Uses `@thallesp/nestjs-better-auth` for NestJS integration
 * - Global module (available throughout the application)
 * - BetterAuthGuard registered here, other guards in {@link AppModule}
 *
 * **Configuration:**
 * Better Auth is configured via {@link createBetterAuth} with settings from
 * environment variables. See `.env.example` for required variables.
 *
 * @module AuthModule
 * @Global - This module is registered as global
 * @see {@link BetterAuthGuard}
 * @see {@link createBetterAuth}
 */
@Global()
@Module({
  imports: [
    ConfigModule,
    BillingModule,
    EmailModule,
    /**
     * Better Auth NestJS module configuration.
     *
     * Disables built-in guards and middleware in favor of explicit
     * configuration in AppModule and main.ts for better control.
     */
    NestBetterAuthModule.forRootAsync({
      imports: [ConfigModule, EmailModule],
      inject: [ConfigService, PrismaService, TurnstileService, EmailService],
      useFactory: async (
        configService: ConfigService,
        prismaService: PrismaService,
        turnstileService: TurnstileService,
        emailService: EmailService
      ) => ({
        auth: await createBetterAuth(configService, {
          prisma: prismaService,
          turnstile: turnstileService,
          email: emailService,
        }),
        // Guard is registered explicitly in this module for better control
        disableGlobalAuthGuard: true,
        // main.ts handles body parsing strategy explicitly to support better-auth
        disableBodyParser: true,
        // CORS is configured in main.ts for consistency
        disableTrustedOriginsCors: true,
      }),
    }),
    /**
     * JWT module for custom token operations.
     *
     * Used for password reset tokens and other custom JWT operations
     * outside of Better Auth's standard flows.
     */
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: getJwtSecret(configService),
        signOptions: {
          expiresIn: getJwtExpiresIn(configService),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthEventsHook,
    EmailVerificationCooldownHook,
    LoginLockoutHook,
    {
      provide: APP_FILTER,
      useClass: BetterAuthApiErrorFilter,
    } satisfies Provider,
    // Register BetterAuthGuard as APP_GUARD here where AUTH_MODULE_OPTIONS_KEY is available
    {
      provide: APP_GUARD,
      useClass: BetterAuthGuard,
    } satisfies Provider,
  ],
})
export class AuthModule {}
