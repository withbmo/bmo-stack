import type { ConfigService } from '@nestjs/config';
import { getPasswordStrength } from '@pytholit/validation';

import { readTrimmedStringOrDefault, readTrimmedStringOrEmpty } from '../config/config-readers';
import {
  API_URL_DEFAULT,
  AUTH_SESSION_TTL_SECONDS,
  AUTH_SESSION_UPDATE_AGE_SECONDS,
  FRONTEND_URL_DEFAULT,
} from '../config/defaults';
import { getJwtSecret } from './auth.config';

function validatePasswordField(body: unknown, key: 'password' | 'newPassword'): void {
  if (!body || typeof body !== 'object') return;
  const value = (body as Record<string, unknown>)[key];
  if (typeof value === 'string') {
    getPasswordStrength(value);
  }
}

/**
 * Creates and configures Better Auth instance.
 *
 * This factory function initializes Better Auth with all required configuration
 * including database connection, OAuth providers, session settings, and plugins.
 *
 * **Configuration Sources:**
 * - Environment variables via ConfigService
 * - Sensible defaults for development
 *
 * **Features Configured:**
 * - PostgreSQL database adapter
 * - Email/password authentication with verification
 * - Session management with cookie cache
 * - OAuth providers (Google, GitHub)
 * - CSRF protection via trusted origins
 *
 * @param {ConfigService} configService - NestJS configuration service
 * @returns {Promise<Auth>} Configured Better Auth instance
 *
 * @example
 * ```typescript
 * // In AuthModule
 * NestBetterAuthModule.forRootAsync({
 *   inject: [ConfigService],
 *   useFactory: async (config) => ({
 *     auth: await createBetterAuth(config),
 *   }),
 * });
 * ```
 *
 * @see {@link https://www.better-auth.com/docs/reference/options Better Auth Options}
 * @see {@link AuthModule}
 */
export async function createBetterAuth(configService: ConfigService) {
  // Dynamic imports to avoid loading during module initialization
  const { betterAuth } = await import('better-auth');
  const { createAuthMiddleware } = await import('better-auth/api');
  const { emailOTP } = await import('better-auth/plugins');
  const { PostgresDialect } = await import('kysely');
  const { Pool } = await import('pg');

  // Configuration from environment variables with fallbacks
  const databaseUrl = configService.get<string>('DATABASE_URL');
  const frontendUrl = readTrimmedStringOrDefault(configService, 'FRONTEND_URL', FRONTEND_URL_DEFAULT);
  const apiUrl = readTrimmedStringOrDefault(configService, 'API_URL', API_URL_DEFAULT);

  // Define a tiny BetterAuth plugin for the hooks since the config type definition doesn't contain a before array.
  // We're essentially writing an inline plugin.
  const passwordValidatorPlugin = {
    id: "password-validator",
    hooks: {
      before: [
        {
          matcher(context: any) {
            return context.path.includes('/sign-up/email') || context.path.includes('/reset-password');
          },
          handler: createAuthMiddleware(async (ctx: any) => {
            if (ctx.path.includes('/sign-up/email')) {
              validatePasswordField(ctx.body, 'password');
            } else if (ctx.path.includes('/reset-password')) {
              validatePasswordField(ctx.body, 'newPassword');
            }
            return { context: ctx };
          }),
        },
      ],
    }
  };

  const providerGatePlugin = {
    id: 'provider-gate',
    hooks: {
      before: [
        {
          matcher(context: any) {
            return context.path === '/sign-in/social';
          },
          handler: createAuthMiddleware(async (ctx: any) => {
            const provider = typeof ctx?.body?.provider === 'string' ? ctx.body.provider : '';
            const hasGoogle =
              Boolean(readTrimmedStringOrEmpty(configService, 'GOOGLE_CLIENT_ID')) &&
              Boolean(readTrimmedStringOrEmpty(configService, 'GOOGLE_CLIENT_SECRET'));
            const hasGithub =
              Boolean(readTrimmedStringOrEmpty(configService, 'GITHUB_CLIENT_ID')) &&
              Boolean(readTrimmedStringOrEmpty(configService, 'GITHUB_CLIENT_SECRET'));

            if ((provider === 'google' && !hasGoogle) || (provider === 'github' && !hasGithub)) {
              const authApi = await import('better-auth');
              throw new authApi.APIError('BAD_REQUEST', {
                code: 'AUTH_OAUTH_PROVIDER_DISABLED',
                detail: `OAuth provider '${provider}' is disabled.`,
              });
            }

            return { context: ctx };
          }),
        },
      ],
    },
  };

  /**
   * Better Auth configuration object.
   *
   * @see {@link https://www.better-auth.com/docs/reference/options}
   */
  return betterAuth({
    /**
     * Base API path for auth endpoints.
     * All Better Auth routes will be prefixed with this path.
     */
    basePath: '/api/v1/auth',

    // Required by @thallesp/nestjs-better-auth when using @Hook providers.
    hooks: {},

    /**
     * Database configuration.
     * Uses Kysely with PostgreSQL.
     */
    database: {
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString: databaseUrl,
        }),
      }),
      type: 'postgres',
    },

    /**
     * Email and password authentication settings.
     */
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true, // Enforce email verification for security
      minPasswordLength: 8,
    },

    /**
     * Verification behavior and callbacks.
     *
     * NOTE: Bonus credits are dispatched from Nest hook providers to keep DI access.
     */
    emailVerification: {
      sendOnSignUp: true,
      // Keep resend explicit to enforce cooldown via /send-verification-email hook.
      sendOnSignIn: false,
      autoSignInAfterVerification: false,
    },

    /**
     * Session configuration.
     * 7-day sessions with daily refresh and cookie caching for performance.
     */
    session: {
      expiresIn: AUTH_SESSION_TTL_SECONDS,
      updateAge: AUTH_SESSION_UPDATE_AGE_SECONDS,
      cookieCache: {
        enabled: true,
        maxAge: AUTH_SESSION_TTL_SECONDS,
      },
    },

    /**
     * OAuth provider configuration.
     * Supports Google and GitHub OAuth.
     */
    socialProviders: {
      google: {
        clientId: readTrimmedStringOrEmpty(configService, 'GOOGLE_CLIENT_ID'),
        clientSecret: readTrimmedStringOrEmpty(configService, 'GOOGLE_CLIENT_SECRET'),
        redirectURI: `${apiUrl}/api/v1/auth/callback/google`,
      },
      github: {
        clientId: readTrimmedStringOrEmpty(configService, 'GITHUB_CLIENT_ID'),
        clientSecret: readTrimmedStringOrEmpty(configService, 'GITHUB_CLIENT_SECRET'),
        redirectURI: `${apiUrl}/api/v1/auth/callback/github`,
      },
    },

    /**
     * Account linking policy.
     * Merge by email with trusted providers.
     */
    account: {
      accountLinking: {
        enabled: true,
        disableImplicitLinking: false,
        trustedProviders: ['google', 'github', 'email-password'],
        allowDifferentEmails: false,
      },
    },

    /**
     * User profile policy.
     * Email changes are disabled by business decision.
     */
    user: {
      changeEmail: {
        enabled: false,
      },
    },

    /**
     * Trusted origins for CSRF protection.
     * Only requests from these origins will be accepted.
     */
    trustedOrigins: [frontendUrl],

    /**
     * Master secret for Better Auth.
     * Used for session encryption and JWT signing.
     */
    secret: getJwtSecret(configService),

    /**
     * Plugins for custom validation and side effects.
     */
    plugins: [
      passwordValidatorPlugin,
      providerGatePlugin,
      emailOTP({
        otpLength: 6,
        expiresIn: 10 * 60,
        allowedAttempts: 5,
        sendVerificationOnSignUp: false,
        overrideDefaultEmailVerification: true,
        storeOTP: 'hashed',
        sendVerificationOTP: async ({ email, otp, type }) => {
          const nodeEnv = (configService.get<string>('NODE_ENV') ?? '').toLowerCase();
          if (nodeEnv !== 'production') {
            // Development-only visibility for direct Better Auth OTP sends.
            console.warn(`DEV_ONLY_OTP email=${email} type=${type} otp=${otp}`);
            return;
          }

          // In production, OTP delivery must go through AuthFlowService + EmailService
          // so rate limits/cooldown and audit rules stay consistent.
          throw new Error(
            'Native Better Auth OTP sending is disabled in production. Use /api/v1/auth-flow/otp/send.'
          );
        },
      }),
    ],
  });
}
