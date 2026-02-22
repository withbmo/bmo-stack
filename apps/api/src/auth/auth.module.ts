import { Global, Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule as NestBetterAuthModule } from '@thallesp/nestjs-better-auth';

import { BillingModule } from '../billing/billing.module';
import { EmailModule } from '../email/email.module';
import { getJwtExpiresIn, getJwtSecret } from './auth.config';
import { AuthController } from './auth.controller';
import { AuthFlowService } from './auth-flow.service';
import { createBetterAuth } from './better-auth.config';
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
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        auth: await createBetterAuth(configService),
        // Guard is registered explicitly in this module for better control
        disableGlobalAuthGuard: true,
        // main.ts handles body parsing strategy explicitly for Stripe webhooks
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
    AuthFlowService,
    AuthEventsHook,
    EmailVerificationCooldownHook,
    LoginLockoutHook,
    // Register BetterAuthGuard as APP_GUARD here where AUTH_MODULE_OPTIONS_KEY is available
    {
      provide: APP_GUARD,
      useClass: BetterAuthGuard,
    } satisfies Provider,
  ],
})
export class AuthModule {}
