import type { ConfigService } from '@nestjs/config';
import { emailHarmony } from 'better-auth-harmony';

import {
  API_URL_DEFAULT,
  AUTH_SESSION_TTL_SECONDS,
  AUTH_SESSION_UPDATE_AGE_SECONDS,
  FRONTEND_URL_DEFAULT,
  JWT_SECRET_DEFAULT,
} from '../config/defaults.js';
import { OAUTH_PROVIDERS, type OAuthProviderKey } from './auth-providers.config.js';
import { passwordValidatorPlugin } from './plugins/password-validator.plugin.js';
import { providerGatePlugin } from './plugins/provider-gate.plugin.js';
import { encryptToken, isEncrypted } from './utils/crypto.util.js';

const OTP_HOURLY_LIMIT = 5;
const DEFAULT_DB_PORT = '5432';
const DEFAULT_SSL_MODE = 'require';
const DEFAULT_LOCAL_DB = {
  host: 'localhost',
  port: DEFAULT_DB_PORT,
  dbName: 'pytholit',
  user: 'postgres',
  password: 'postgres',
  sslMode: 'disable',
} as const;

/** Cloudflare Turnstile test secret — always passes, safe for non-production use. */
const TURNSTILE_DEV_SECRET = '1x0000000000000000000000000000000AA';

function resolveDatabaseUrl(configService: ConfigService): string {
  const host = configService.get<string>('DB_HOST')?.trim();
  const user = configService.get<string>('DB_USERNAME')?.trim();
  const password = configService.get<string>('DB_PASSWORD')?.trim();
  const dbName = configService.get<string>('DB_NAME')?.trim();
  const port = configService.get<string>('DB_PORT')?.trim() || DEFAULT_DB_PORT;
  const sslMode = configService.get<string>('DB_SSLMODE')?.trim() || DEFAULT_SSL_MODE;
  const isProd = configService.get<string>('NODE_ENV') === 'production';

  if (!host || !user || !password || !dbName) {
    if (isProd) {
      throw new Error('DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, and DB_PASSWORD must be set in production.');
    }
    return buildDatabaseUrl(DEFAULT_LOCAL_DB);
  }
  return buildDatabaseUrl({ host, port, dbName, user, password, sslMode });
}

function buildDatabaseUrl(options: {
  host: string;
  port: string;
  dbName: string;
  user: string;
  password: string;
  sslMode: string;
}): string {
  const encodedUser = encodeURIComponent(options.user);
  const encodedPassword = encodeURIComponent(options.password);
  const params = new URLSearchParams({ schema: 'public', sslmode: options.sslMode });
  return `postgresql://${encodedUser}:${encodedPassword}@${options.host}:${options.port}/${options.dbName}?${params.toString()}`;
}

/**
 * Builds a configured Better Auth instance for the NestJS API.
 *
 * Reads settings from `ConfigService` and wires up the database, sessions,
 * providers, and plugins used by the rest of the auth module.
 */
export async function createBetterAuth(configService: ConfigService): Promise<unknown> {
  // Dynamic imports to avoid loading during module initialization
  const { betterAuth } = await import('better-auth');
  const { captcha, emailOTP, username } = await import('better-auth/plugins');
  const { PostgresDialect } = await import('kysely');
  const { Pool } = await import('pg');

  // Configuration from environment variables with fallbacks
  const databaseUrl = resolveDatabaseUrl(configService);
  const frontendUrl = configService.get<string>('FRONTEND_URL') ?? FRONTEND_URL_DEFAULT;
  const apiUrl = configService.get<string>('API_URL') ?? API_URL_DEFAULT;

  const encryptionSecret = configService.get<string>('INTERNAL_SECRET') ?? 'temp-dev-secret-123456';
  const isProd = configService.get<string>('NODE_ENV') === 'production';
  const isDev = !isProd;
  const jwtSecret = configService.get<string>('JWT_SECRET') ?? '';
  const authSecret = jwtSecret || (isProd ? (() => {
    throw new Error('JWT_SECRET must be set in production');
  })() : JWT_SECRET_DEFAULT);
  const turnstileSecretKey = isDev
    ? TURNSTILE_DEV_SECRET
    : (() => {
        const key = configService.get<string>('TURNSTILE_SECRET_KEY') ?? '';
        if (!key) {
          throw new Error('TURNSTILE_SECRET_KEY is required in production.');
        }
        return key;
      })();


  return betterAuth({
    basePath: '/api/v1/auth',
    /** Root URL of the API (e.g. http://localhost:3001). Required for OAuth callbacks and email links. Set API_URL in env. */
    baseURL: apiUrl,

    // Required by @thallesp/nestjs-better-auth when using @Hook providers.
    hooks: {},

    database: {
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString: databaseUrl,
        }),
      }),
      type: 'postgres',
    },

    rateLimit: {
      enabled: true,
      storage: 'database',
      window: 60,
      max: 100, // global normal limit per 60 secs
      customRules: {
        '/email-otp/send-verification-otp': async () => {
          return {
            window: 3600, // 1 hour window 
            max: OTP_HOURLY_LIMIT,
          };
        },
        '/sign-in/email': async () => {
          return {
            window: 60, // 1 min window
            max: 5,
          }
        }
      }
    },

    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true, // Enforce email verification for security
      minPasswordLength: 8,
    },

    emailVerification: {
      sendOnSignUp: true,
      async sendVerificationEmail({ user, url }) {
        const email = String(user.email ?? '').trim().toLowerCase();
        const { sendEmail } = await import('@better-auth/infra');
        await sendEmail({
          template: 'verify-email',
          to: email,
          variables: {
            verificationUrl: url,
            userEmail: email,
            userName: (user as any).name ?? deriveNameFromEmail(email),
            appName: 'Pytholit',
          },
        });
      },
      sendOnSignIn: false,
      autoSignInAfterVerification: true,
    },

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

    socialProviders: Object.fromEntries(
      (
        Object.entries(OAUTH_PROVIDERS) as [
          OAuthProviderKey,
          (typeof OAUTH_PROVIDERS)[OAuthProviderKey],
        ][]
      ).map(([key, def]) => [
        key,
        {
          clientId: configService.get<string>(def.clientIdKey) ?? '',
          clientSecret: configService.get<string>(def.clientSecretKey) ?? '',
          ...(def.callbackUrlKey
            ? {
              redirectURI:
                (configService.get<string>(def.callbackUrlKey) ?? '') ||
                `${apiUrl}/api/v1/auth/callback/${key}`,
            }
            : { redirectURI: `${apiUrl}/api/v1/auth/callback/${key}` }),
        },
      ])
    ),

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
        trustedProviders: [
          ...(Object.keys(OAUTH_PROVIDERS) as OAuthProviderKey[]),
          'email-password',
        ],
        allowDifferentEmails: false,
        allowUnlinkingAll: false,
      },
    },

    databaseHooks: {
      account: {
        create: {
          before: async (account) => {
            const data = { ...account } as Record<string, any>;
            if (account.accessToken) {
              data.accessToken = encryptToken(account.accessToken, encryptionSecret);
            }
            if (account.refreshToken) {
              data.refreshToken = encryptToken(account.refreshToken, encryptionSecret);
            }
            // Some providers store idTokens
            if (data.idToken) {
              data.idToken = encryptToken(data.idToken, encryptionSecret);
            }
            return { data: data as typeof account };
          },
        },
        update: {
          before: async (account) => {
            const data = { ...account } as Record<string, any>;
            if (account.accessToken?.length && !isEncrypted(account.accessToken)) {
              data.accessToken = encryptToken(account.accessToken, encryptionSecret);
            }
            if (account.refreshToken?.length && !isEncrypted(account.refreshToken)) {
              data.refreshToken = encryptToken(account.refreshToken, encryptionSecret);
            }
            if (data.idToken?.length && !isEncrypted(data.idToken)) {
              data.idToken = encryptToken(data.idToken, encryptionSecret);
            }
            return { data: data as typeof account };
          }
        }
      },
    },

    user: {
      modelName: 'users',
      deleteUser: {
        enabled: true,
        async sendDeleteAccountVerification({ user, url }) {
          const email = String((user as any).email ?? '').trim().toLowerCase();
          const { sendEmail } = await import('@better-auth/infra');
          await sendEmail({
            template: 'delete-account',
            to: email,
            variables: {
              deletionLink: url,
              userEmail: email,
              appName: 'Pytholit',
              expirationMinutes: '60',
            },
          });
        },
      },
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

    trustedOrigins: [frontendUrl, apiUrl],

    secret: authSecret,

    plugins: [
      emailHarmony(),
      passwordValidatorPlugin(),
      captcha({
        provider: 'cloudflare-turnstile',
        secretKey: turnstileSecretKey,
        endpoints: ['/sign-up/email', '/sign-in/email', '/email-otp/send-verification-otp'],
      }),
      providerGatePlugin(configService),
      username({
        minUsernameLength: 3,
        maxUsernameLength: 30,
        usernameValidator: (value: string) => {
          const reserved = new Set(['admin', 'support', 'root', 'system']);
          if (reserved.has(value.toLowerCase())) return false;
          // Alphanumeric, underscore and dot only
          return /^[a-zA-Z0-9._]+$/.test(value);
        },
        displayUsernameValidator: (display: string) => {
          // Allow letters, numbers, space, underscore and hyphen
          return /^[a-zA-Z0-9 _-]+$/.test(display);
        },
      }),
      emailOTP({
        otpLength: 6,
        expiresIn: 10 * 60,
        allowedAttempts: 5,
        sendVerificationOnSignUp: false,
        overrideDefaultEmailVerification: true,
        storeOTP: 'hashed',
        sendVerificationOTP: async ({ email, otp, type }) => {
          const normalizedEmail = email.trim().toLowerCase();
          const { sendEmail } = await import('@better-auth/infra');

          if (type === 'sign-in') {
            await sendEmail({
              template: 'sign-in-otp',
              to: normalizedEmail,
              variables: {
                otpCode: otp,
                userEmail: normalizedEmail,
                appName: 'Pytholit',
                expirationMinutes: '10',
              },
            });
          } else if (type === 'forget-password') {
            await sendEmail({
              template: 'reset-password-otp',
              to: normalizedEmail,
              variables: {
                otpCode: otp,
                userEmail: normalizedEmail,
                appName: 'Pytholit',
                expirationMinutes: '10',
              },
            });
          } else {
            // Default to email verification OTP
            await sendEmail({
              template: 'verify-email-otp',
              to: normalizedEmail,
              variables: {
                otpCode: otp,
                userEmail: normalizedEmail,
                appName: 'Pytholit',
                expirationMinutes: '10',
              },
            });
          }
        },
      }),
    ],
  });
}



function deriveNameFromEmail(email: string): string {
  const local = email.split('@')[0]?.trim() || 'there';
  return local.replace(/[._-]/g, ' ').slice(0, 40) || 'there';
}
