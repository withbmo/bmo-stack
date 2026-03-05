import type { ConfigService } from '@nestjs/config';
import { validatePasswordStrength } from '@pytholit/validation';
import { randomUUID } from 'crypto';

import { TurnstileService } from '../common/services/turnstile.service';
import { readTrimmedStringOrDefault, readTrimmedStringOrEmpty } from '../config/config-readers';
import { OAUTH_PROVIDERS, type OAuthProviderKey } from './auth-providers.config';
import {
  API_URL_DEFAULT,
  AUTH_SESSION_TTL_SECONDS,
  AUTH_SESSION_UPDATE_AGE_SECONDS,
  FRONTEND_URL_DEFAULT,
} from '../config/defaults';
import { PrismaService } from '../database/prisma.service';
import { EmailService } from '../email/email.service';
import { getJwtSecret } from './auth.config';

const OTP_COOLDOWN_SECONDS = 60;
const OTP_HOURLY_LIMIT = 5;
const OTP_DAILY_LIMIT = 10;
const OTP_LOCK_MINUTES = 15;

type BetterAuthServices = {
  prisma: PrismaService;
  turnstile: TurnstileService;
  email: EmailService;
};

type ApiErrorConstructor = new (...args: any[]) => Error;

function validatePasswordField(body: unknown, key: 'password' | 'newPassword'): void {
  if (!body || typeof body !== 'object') return;
  const value = (body as Record<string, unknown>)[key];
  if (typeof value === 'string') {
    // Fix #7B: Use validatePasswordStrength (throws on weak password) instead of getPasswordStrength (info-only)
    validatePasswordStrength(value);
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
export async function createBetterAuth(configService: ConfigService, services: BetterAuthServices) {
  // Dynamic imports to avoid loading during module initialization
  const { APIError, betterAuth } = await import('better-auth');
  const { createAuthMiddleware } = await import('better-auth/api');
  const { emailOTP, username } = await import('better-auth/plugins');
  const { PostgresDialect } = await import('kysely');
  const { Pool } = await import('pg');

  // Configuration from environment variables with fallbacks
  const databaseUrl = configService.get<string>('DATABASE_URL');
  const frontendUrl = readTrimmedStringOrDefault(
    configService,
    'FRONTEND_URL',
    FRONTEND_URL_DEFAULT
  );
  const apiUrl = readTrimmedStringOrDefault(configService, 'API_URL', API_URL_DEFAULT);

  // Define a tiny BetterAuth plugin for the hooks since the config type definition doesn't contain a before array.
  // We're essentially writing an inline plugin.
  const passwordValidatorPlugin = {
    id: 'password-validator',
    hooks: {
      before: [
        {
          matcher(context: any) {
            return (
              context.path.includes('/sign-up/email') || context.path.includes('/reset-password')
            );
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
    },
  };

  const readIpFromCtx = (ctx: any): string | undefined => {
    const headers = ctx?.request?.headers as
      | Headers
      | { [key: string]: string | string[] | undefined }
      | undefined;
    if (!headers) return undefined;
    if (typeof (headers as Headers).get === 'function') {
      const forwarded = (headers as Headers).get('x-forwarded-for')?.split(',')[0]?.trim();
      const cf = (headers as Headers).get('cf-connecting-ip')?.trim();
      const real = (headers as Headers).get('x-real-ip')?.trim();
      return forwarded || cf || real || undefined;
    }
    const headerMap = headers as { [key: string]: string | string[] | undefined };
    const first = (value: string | string[] | undefined): string | undefined =>
      Array.isArray(value) ? value[0] : value;
    const forwarded = first(headerMap['x-forwarded-for'])?.split(',')[0]?.trim();
    const cf = first(headerMap['cf-connecting-ip'])?.trim();
    const real = first(headerMap['x-real-ip'])?.trim();
    return forwarded || cf || real || undefined;
  };

  const readCaptchaToken = (ctx: any): string | null => {
    const bodyToken = typeof ctx?.body?.captchaToken === 'string' ? ctx.body.captchaToken.trim() : '';
    if (bodyToken) return bodyToken;

    const headers = ctx?.request?.headers as
      | Headers
      | { [key: string]: string | string[] | undefined }
      | undefined;
    if (!headers) return null;
    if (typeof (headers as Headers).get === 'function') {
      const token = (headers as Headers).get('x-captcha-token');
      return token?.trim() || null;
    }

    const raw = (headers as { [key: string]: string | string[] | undefined })['x-captcha-token'];
    if (Array.isArray(raw)) return raw[0]?.trim() || null;
    return typeof raw === 'string' ? raw.trim() || null : null;
  };

  const captchaPlugin = {
    id: 'captcha-gate',
    hooks: {
      before: [
        {
          matcher(context: any) {
            return (
              context.path === '/sign-up/email' ||
              context.path === '/sign-in/email' ||
              context.path === '/email-otp/send-verification-otp'
            );
          },
          handler: createAuthMiddleware(async (ctx: any) => {
            if (services.turnstile.isDevelopmentMode()) {
              return { context: ctx };
            }
            const token = readCaptchaToken(ctx);
            if (!token) {
              throw new APIError('BAD_REQUEST', {
                code: 'AUTH_CAPTCHA_REQUIRED',
                detail: 'CAPTCHA token is required.',
              });
            }
            const valid = await services.turnstile.verifyToken(token, readIpFromCtx(ctx));
            if (!valid) {
              throw new APIError('BAD_REQUEST', {
                code: 'AUTH_CAPTCHA_INVALID',
                detail: 'Invalid CAPTCHA token.',
              });
            }
            return { context: ctx };
          }),
        },
      ],
    },
  };

  const isProviderEnabled = (key: OAuthProviderKey): boolean => {
    const def = OAUTH_PROVIDERS[key];
    return (
      Boolean(readTrimmedStringOrEmpty(configService, def.clientIdKey)) &&
      Boolean(readTrimmedStringOrEmpty(configService, def.clientSecretKey))
    );
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
            const isKnown = Object.prototype.hasOwnProperty.call(OAUTH_PROVIDERS, provider);

            if (!isKnown || !isProviderEnabled(provider as OAuthProviderKey)) {
              throw new APIError('BAD_REQUEST', {
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
      // Fix #6: Enable autoSignInAfterVerification so users are signed in after OTP verification
      // Without this, verifyEmailOTP doesn't create a session, leaving users unauthenticated
      autoSignInAfterVerification: true,
    },

    /**
     * Session configuration.
     * 7-day sessions with daily refresh and cookie caching for performance.
     */
    session: {
      modelName: 'sessions',
      fields: {
        expiresAt: 'expires_at',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        ipAddress: 'ip_address',
        userAgent: 'user_agent',
        userId: 'user_id',
      },
      expiresIn: AUTH_SESSION_TTL_SECONDS,
      updateAge: AUTH_SESSION_UPDATE_AGE_SECONDS,
      cookieCache: {
        enabled: true,
        maxAge: AUTH_SESSION_TTL_SECONDS,
      },
    },

    /**
     * OAuth provider configuration — derived from OAUTH_PROVIDERS registry.
     * To add/remove a provider, update auth-providers.config.ts only.
     */
    socialProviders: Object.fromEntries(
      (Object.entries(OAUTH_PROVIDERS) as [OAuthProviderKey, (typeof OAUTH_PROVIDERS)[OAuthProviderKey]][]).map(
        ([key, def]) => [
          key,
          {
            clientId: readTrimmedStringOrEmpty(configService, def.clientIdKey),
            clientSecret: readTrimmedStringOrEmpty(configService, def.clientSecretKey),
            ...(def.callbackUrlKey
              ? { redirectURI: readTrimmedStringOrEmpty(configService, def.callbackUrlKey) || `${apiUrl}/api/v1/auth/callback/${key}` }
              : { redirectURI: `${apiUrl}/api/v1/auth/callback/${key}` }),
          },
        ]
      )
    ),

    /**
     * Account linking policy.
     * Merge by email with trusted providers.
     */
    account: {
      modelName: 'accounts',
      fields: {
        accountId: 'account_id',
        providerId: 'provider_id',
        userId: 'user_id',
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
        idToken: 'id_token',
        scope: 'scope',
        password: 'password',
        expiresAt: 'expires_at',
        accessTokenExpiresAt: 'access_token_expires_at',
        refreshTokenExpiresAt: 'refresh_token_expires_at',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      },
      accountLinking: {
        enabled: true,
        disableImplicitLinking: false,
        trustedProviders: [...(Object.keys(OAUTH_PROVIDERS) as OAuthProviderKey[]), 'email-password'],
        allowDifferentEmails: false,
      },
    },

    /**
     * User profile policy.
     * Email changes are disabled by business decision.
     */
    user: {
      modelName: 'users',
      fields: {
        name: 'username',
        emailVerified: 'is_email_verified',
        image: 'avatar_url',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      },
      additionalFields: {
        firstName: {
          type: 'string',
          required: false,
          fieldName: 'first_name',
        },
        lastName: {
          type: 'string',
          required: false,
          fieldName: 'last_name',
        },
        isActive: {
          type: 'boolean',
          required: false,
          defaultValue: true,
          fieldName: 'is_active',
        },
      },
      changeEmail: {
        enabled: false,
      },
    },

    verification: {
      modelName: 'verification',
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
      captchaPlugin,
      providerGatePlugin,
      username(),
      emailOTP({
        otpLength: 6,
        expiresIn: 10 * 60,
        allowedAttempts: 5,
        sendVerificationOnSignUp: false,
        overrideDefaultEmailVerification: true,
        storeOTP: 'hashed',
        sendVerificationOTP: async ({ email, otp, type }, ctx) => {
          void type;
          const ip = readIpFromCtx(ctx);
          const ipKey = ip?.trim().slice(0, 120) || 'unknown';
          const normalizedEmail = email.trim().toLowerCase();

          await enforceSendLimits(services.prisma, normalizedEmail, ipKey, APIError);

          await services.email.sendOtpVerificationEmail({
            toEmail: normalizedEmail,
            toName: deriveNameFromEmail(normalizedEmail),
            code: otp,
            expiresInMinutes: 10,
          });
        },
      }),
    ],
  });
}

async function enforceSendLimits(
  prisma: PrismaService,
  email: string,
  ip: string,
  APIErrorCtor: ApiErrorConstructor
): Promise<void> {
  await enforceThrottleWindow(prisma, email, ip, 'send_hourly', 3600, OTP_HOURLY_LIMIT, APIErrorCtor);
  await enforceThrottleWindow(prisma, email, ip, 'send_daily', 86400, OTP_DAILY_LIMIT, APIErrorCtor);
  await enforceSendCooldown(prisma, email, ip, APIErrorCtor);
}

async function enforceThrottleWindow(
  prisma: PrismaService,
  email: string,
  ip: string,
  action: string,
  windowSec: number,
  maxAttempts: number,
  APIErrorCtor: ApiErrorConstructor
): Promise<void> {
  const now = new Date();
  const windowMs = windowSec * 1000;
  const windowStart = new Date(Math.floor(now.getTime() / windowMs) * windowMs);
  const lockUntil = new Date(now.getTime() + OTP_LOCK_MINUTES * 60 * 1000);

  const lockedRow = await prisma.client.authOtpThrottle.findFirst({
    where: {
      email,
      ip,
      action,
      lockedUntil: { gt: now },
    },
    orderBy: { lockedUntil: 'desc' },
    select: { lockedUntil: true },
  });

  if (lockedRow?.lockedUntil) {
    throw new APIErrorCtor('TOO_MANY_REQUESTS', {
      code: 'AUTH_OTP_LOCKED',
      detail: `Too many OTP attempts. Try again after ${lockedRow.lockedUntil.toISOString()}.`,
    });
  }

  const record = await prisma.client.authOtpThrottle.upsert({
    where: {
      email_ip_action_windowStart_windowSec: {
        email,
        ip,
        action,
        windowStart,
        windowSec,
      },
    },
    update: {
      attempts: { increment: 1 },
    },
    create: {
      id: randomUUID(),
      email,
      ip,
      action,
      windowStart,
      windowSec,
      attempts: 1,
    },
    select: { attempts: true },
  });

  const attempts = Number(record.attempts ?? 0);
  if (attempts > maxAttempts) {
    await prisma.client.authOtpThrottle.updateMany({
      where: { email, ip, action, windowStart, windowSec },
      data: { lockedUntil: lockUntil },
    });
    throw new APIErrorCtor('TOO_MANY_REQUESTS', {
      code: 'AUTH_OTP_LOCKED',
      detail: `Too many OTP attempts. Try again after ${lockUntil.toISOString()}.`,
    });
  }
}

async function enforceSendCooldown(
  prisma: PrismaService,
  email: string,
  ip: string,
  APIErrorCtor: ApiErrorConstructor
): Promise<void> {
  const now = Date.now();
  const windowMs = OTP_COOLDOWN_SECONDS * 1000;
  const windowStart = new Date(Math.floor(now / windowMs) * windowMs);

  const record = await prisma.client.authOtpThrottle.upsert({
    where: {
      email_ip_action_windowStart_windowSec: {
        email,
        ip,
        action: 'send_cooldown',
        windowStart,
        windowSec: OTP_COOLDOWN_SECONDS,
      },
    },
    update: {
      attempts: { increment: 1 },
    },
    create: {
      id: randomUUID(),
      email,
      ip,
      action: 'send_cooldown',
      windowStart,
      windowSec: OTP_COOLDOWN_SECONDS,
      attempts: 1,
    },
    select: { attempts: true },
  });

  const attempts = Number(record.attempts ?? 0);
  if (attempts > 1) {
    const retryAt = new Date(windowStart.getTime() + OTP_COOLDOWN_SECONDS * 1000).toISOString();
    throw new APIErrorCtor('TOO_MANY_REQUESTS', {
      code: 'AUTH_OTP_COOLDOWN',
      detail: `OTP already sent. Try again after ${retryAt}.`,
    });
  }
}

function deriveNameFromEmail(email: string): string {
  const local = email.split('@')[0]?.trim() || 'there';
  return local.replace(/[._-]/g, ' ').slice(0, 40) || 'there';
}
