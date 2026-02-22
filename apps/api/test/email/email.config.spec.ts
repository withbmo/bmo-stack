import { resolveEmailRuntimeConfig } from '../../src/email/email.config';

describe('resolveEmailRuntimeConfig', () => {
  const makeConfigService = (values: Record<string, string | number | boolean | undefined>) => ({
    get: (key: string) => values[key],
  });

  it('resolves SMTP and queue settings', () => {
    const config = resolveEmailRuntimeConfig(
      makeConfigService({
        NODE_ENV: 'development',
        APP_ENV: 'localhost',
        REDIS_URL: 'redis://localhost:6379',
        SMTP_HOST: 'smtp.example.com',
        SMTP_PORT: '587',
        SMTP_USER: 'user',
        SMTP_PASS: 'pass',
        SMTP_SECURE: 'false',
        EMAIL_FROM_ADDRESS: 'noreply@example.com',
        EMAIL_FROM_NAME: 'Example',
        EMAIL_QUEUE_CONCURRENCY: '12',
        EMAIL_QUEUE_RATE_LIMIT_MAX: '100',
        EMAIL_QUEUE_RATE_LIMIT_DURATION_MS: '2000',
        EMAIL_QUEUE_REMOVE_ON_COMPLETE: '1500',
        EMAIL_QUEUE_REMOVE_ON_FAIL: '8000',
      }),
    );

    expect(config.smtpEnabled).toBe(true);
    expect(config.queueEnabled).toBe(true);
    expect(config.queueConcurrency).toBe(12);
    expect(config.queueRateLimitMax).toBe(100);
    expect(config.queueRateLimitDurationMs).toBe(2000);
    expect(config.queueRemoveOnComplete).toBe(1500);
    expect(config.queueRemoveOnFail).toBe(8000);
  });

  it('throws in production-like env when SMTP is missing', () => {
    expect(() =>
      resolveEmailRuntimeConfig(
        makeConfigService({
          NODE_ENV: 'production',
          APP_ENV: 'production',
          REDIS_URL: 'redis://localhost:6379',
        }),
      ),
    ).toThrow('Email SMTP config is required');
  });

  it('throws in production-like env when Redis queue is missing', () => {
    expect(() =>
      resolveEmailRuntimeConfig(
        makeConfigService({
          NODE_ENV: 'production',
          APP_ENV: 'production',
          SMTP_HOST: 'smtp.example.com',
          SMTP_PORT: '587',
          SMTP_USER: 'user',
          SMTP_PASS: 'pass',
          EMAIL_FROM_ADDRESS: 'noreply@example.com',
        }),
      ),
    ).toThrow('REDIS_URL is required');
  });

  it('accepts envalid-style number/boolean values', () => {
    const config = resolveEmailRuntimeConfig(
      makeConfigService({
        NODE_ENV: 'development',
        APP_ENV: 'localhost',
        REDIS_URL: 'redis://localhost:6379',
        SMTP_HOST: 'smtp.example.com',
        SMTP_PORT: 465,
        SMTP_USER: 'user',
        SMTP_PASS: 'pass',
        SMTP_SECURE: true,
        EMAIL_QUEUE_CONCURRENCY: 7,
      }),
    );

    expect(config.smtpPort).toBe(465);
    expect(config.smtpSecure).toBe(true);
    expect(config.queueConcurrency).toBe(7);
  });
});
