import { bool, cleanEnv, num, str } from 'envalid';

import {
  EMAIL_DEFAULT_FROM_ADDRESS,
  EMAIL_DEFAULT_FROM_NAME,
  EMAIL_DEFAULT_SMTP_PORT,
  EMAIL_QUEUE_CONCURRENCY_DEFAULT,
  EMAIL_QUEUE_RATE_LIMIT_DURATION_MS_DEFAULT,
  EMAIL_QUEUE_RATE_LIMIT_MAX_DEFAULT,
  EMAIL_QUEUE_REMOVE_ON_COMPLETE_DEFAULT,
  EMAIL_QUEUE_REMOVE_ON_FAIL_DEFAULT,
  ENV_SESSION_TTL_SECONDS_DEFAULT,
  FRONTEND_URL_DEFAULT,
  JWT_EXPIRES_IN_DEFAULT,
  JWT_SECRET_DEFAULT,
  ORCHESTRATOR_CIRCUIT_FAILURE_THRESHOLD_DEFAULT,
  ORCHESTRATOR_CIRCUIT_OPEN_MS_DEFAULT,
  ORCHESTRATOR_TIMEOUT_MS_DEFAULT,
  ORCHESTRATOR_URL_DEFAULT,
  TERMINAL_GATEWAY_WS_URL_DEFAULT,
  UPLOAD_DIR_DEFAULT,
  WIZARD_DEFAULT_TEMPLATE_ID_DEFAULT,
  WIZARD_DEFAULT_VERSION_DEFAULT,
  WIZARD_LEGACY_TEMPLATE_ID_DEFAULT,
} from './defaults';

export function validateEnv() {
  const env = cleanEnv(process.env, {
    APP_ENV: str({ default: '' }),
    NODE_ENV: str({ default: 'development' }),
    PORT: num({ default: 3001 }),
    API_URL: str({ default: '' }),
    FRONTEND_URL: str({ default: FRONTEND_URL_DEFAULT }),
    COOKIE_DOMAIN: str({ default: '' }),
    DATABASE_URL: str({ default: '' }),
    TURNSTILE_SECRET_KEY: str({ default: '' }),
    REDIS_URL: str({ default: '' }),
    JWT_EXPIRES_IN: str({ default: JWT_EXPIRES_IN_DEFAULT }),
    GOOGLE_CLIENT_ID: str({ default: '' }),
    GOOGLE_CLIENT_SECRET: str({ default: '' }),
    GOOGLE_CALLBACK_URL: str({ default: '' }),
    GITHUB_CLIENT_ID: str({ default: '' }),
    GITHUB_CLIENT_SECRET: str({ default: '' }),
    GITHUB_CALLBACK_URL: str({ default: '' }),
    SMTP_HOST: str({ default: '' }),
    SMTP_PORT: str({ default: String(EMAIL_DEFAULT_SMTP_PORT) }),
    SMTP_USER: str({ default: '' }),
    SMTP_PASS: str({ default: '' }),
    SMTP_SECURE: str({ default: '' }),
    EMAIL_FROM_ADDRESS: str({ default: EMAIL_DEFAULT_FROM_ADDRESS }),
    EMAIL_FROM_NAME: str({ default: EMAIL_DEFAULT_FROM_NAME }),
    EMAIL_ALLOWED_DOMAINS: str({ default: '' }),
    EMAIL_BLOCKED_DOMAINS: str({ default: '' }),
    EMAIL_QUEUE_CONCURRENCY: num({ default: EMAIL_QUEUE_CONCURRENCY_DEFAULT }),
    EMAIL_QUEUE_RATE_LIMIT_MAX: num({ default: EMAIL_QUEUE_RATE_LIMIT_MAX_DEFAULT }),
    EMAIL_QUEUE_RATE_LIMIT_DURATION_MS: num({ default: EMAIL_QUEUE_RATE_LIMIT_DURATION_MS_DEFAULT }),
    EMAIL_QUEUE_REMOVE_ON_COMPLETE: num({ default: EMAIL_QUEUE_REMOVE_ON_COMPLETE_DEFAULT }),
    EMAIL_QUEUE_REMOVE_ON_FAIL: num({ default: EMAIL_QUEUE_REMOVE_ON_FAIL_DEFAULT }),
    INITIAL_ADMIN_EMAIL: str({ default: '' }),
    NOVU_API_KEY: str({ default: '' }),
    NOVU_SUBSCRIBER_HASH_SECRET: str({ default: '' }),
    UPLOAD_DIR: str({ default: UPLOAD_DIR_DEFAULT }),
    WIZARD_DEFAULT_VERSION: str({ default: WIZARD_DEFAULT_VERSION_DEFAULT }),
    WIZARD_DEFAULT_TEMPLATE_ID: str({ default: WIZARD_DEFAULT_TEMPLATE_ID_DEFAULT }),
    WIZARD_LEGACY_TEMPLATE_ID: str({ default: WIZARD_LEGACY_TEMPLATE_ID_DEFAULT }),
    ORCHESTRATOR_URL: str({ default: ORCHESTRATOR_URL_DEFAULT }),
    ORCHESTRATOR_TIMEOUT_MS: num({ default: ORCHESTRATOR_TIMEOUT_MS_DEFAULT }),
    ORCHESTRATOR_CIRCUIT_FAILURE_THRESHOLD: num({
      default: ORCHESTRATOR_CIRCUIT_FAILURE_THRESHOLD_DEFAULT,
    }),
    ORCHESTRATOR_CIRCUIT_OPEN_MS: num({ default: ORCHESTRATOR_CIRCUIT_OPEN_MS_DEFAULT }),
    INTERNAL_SECRET: str({ default: '' }),
    JWT_SECRET: str({ default: JWT_SECRET_DEFAULT }),
    ENV_SESSION_SECRET: str({ default: '' }),
    ENV_SESSION_TTL_SECONDS: num({ default: ENV_SESSION_TTL_SECONDS_DEFAULT }),
    TERMINAL_GATEWAY_WS_URL: str({ default: TERMINAL_GATEWAY_WS_URL_DEFAULT }),
    ENABLE_EXTERNAL_PROD_API_KEY_MODE: bool({ default: false }),

    // Billing — Stripe (payments + subscriptions)
    STRIPE_SECRET_KEY: str({ default: '' }),
    STRIPE_WEBHOOK_SECRET: str({ default: '' }),
    BILLING_USE_STRIPE_USAGE: bool({ default: true }),
    BILLING_USE_STRIPE_CREDITS: bool({ default: true }),
  });

  // Normalize whitespace once at boot so feature config services can consume stable values.
  return Object.fromEntries(
    Object.entries(env).map(([key, value]) => [
      key,
      typeof value === 'string' ? value.trim() : value,
    ])
  );
}
