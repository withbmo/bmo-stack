import { Global, Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule as NestBetterAuthModule } from '@thallesp/nestjs-better-auth';

import { AuthController } from './auth.controller.js';
import { createBetterAuth } from './better-auth.config.js';
import { BetterAuthGuard } from './guards/better-auth.guard.js';
import { AuthEventsHook } from './hooks/auth-events.hook.js';
import { EmailVerificationCooldownHook } from './hooks/email-verification-cooldown.hook.js';
import { LoginLockoutHook } from './hooks/login-lockout.hook.js';

/**
 * Global authentication module that wires Better Auth into NestJS.
 *
 * Registers the Better Auth instance, global guard, and supporting hooks used
 * across the API.
 */
@Global()
@Module({
  imports: [
    ConfigModule,
    /**
     * Better Auth NestJS module configuration.
     *
     * Keeps guard and CORS behavior explicit while letting the adapter
     * restore body parsing for non-auth routes when Nest starts with
     * `bodyParser: false`.
     */
    NestBetterAuthModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        auth: await createBetterAuth(configService),
        // Guard is registered explicitly in this module for better control
        disableGlobalAuthGuard: true,
        // CORS is configured in main.ts for consistency
        disableTrustedOriginsCors: true,
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
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
