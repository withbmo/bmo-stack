import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { z } from 'zod';

import {
  EMAIL_DEFAULT_FROM_ADDRESS,
  EMAIL_DEFAULT_FROM_NAME,
  EMAIL_DEFAULT_SMTP_PORT,
  EMAIL_QUEUE_CONCURRENCY_DEFAULT,
  EMAIL_QUEUE_RATE_LIMIT_DURATION_MS_DEFAULT,
  EMAIL_QUEUE_RATE_LIMIT_MAX_DEFAULT,
  EMAIL_QUEUE_REMOVE_ON_COMPLETE_DEFAULT,
  EMAIL_QUEUE_REMOVE_ON_FAIL_DEFAULT,
} from './email.constants';

export interface EmailRuntimeConfig {
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  smtpSecure: boolean;
  fromAddress: string;
  fromName: string;
  redisUrl: string;
  smtpEnabled: boolean;
  queueEnabled: boolean;
  queueConcurrency: number;
  queueRateLimitMax: number;
  queueRateLimitDurationMs: number;
  queueRemoveOnComplete: number;
  queueRemoveOnFail: number;
  isLocalhost: boolean;
  isProductionLike: boolean;
  allowedDomains: readonly string[];
  blockedDomains: readonly string[];
}

const stringishSchema = z.preprocess((value) => {
  if (typeof value === 'string') {
    return value.trim();
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value).trim();
  }
  return '';
}, z.string());

const csvSchema = stringishSchema.transform((value) =>
  value
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter((entry) => entry.length > 0),
);

const positiveIntWithDefault = (fallback: number) =>
  z
    .preprocess((value) => {
      if (typeof value === 'number' && Number.isFinite(value)) {
        return Math.trunc(value);
      }
      if (typeof value === 'string') {
        const parsed = Number.parseInt(value.trim(), 10);
        return Number.isFinite(parsed) ? parsed : Number.NaN;
      }
      if (typeof value === 'boolean') {
        return Number.NaN;
      }
      return Number.NaN;
    }, z.number().int().positive())
    .catch(fallback);

const rawEmailConfigSchema = z.object({
  nodeEnv: stringishSchema.catch('development').transform((v) => v.toLowerCase() || 'development'),
  appEnv: stringishSchema.catch('').transform((v) => v.toLowerCase()),
  smtpHost: stringishSchema.catch(''),
  smtpPort: positiveIntWithDefault(EMAIL_DEFAULT_SMTP_PORT),
  smtpUser: stringishSchema.catch(''),
  smtpPass: stringishSchema.catch(''),
  smtpSecureRaw: stringishSchema.catch(''),
  fromAddress: stringishSchema.catch('').transform((v) => v || EMAIL_DEFAULT_FROM_ADDRESS),
  fromName: stringishSchema.catch('').transform((v) => v || EMAIL_DEFAULT_FROM_NAME),
  redisUrl: stringishSchema.catch(''),
  allowedDomains: csvSchema.catch([]),
  blockedDomains: csvSchema.catch([]),
  queueConcurrency: positiveIntWithDefault(EMAIL_QUEUE_CONCURRENCY_DEFAULT),
  queueRateLimitMax: positiveIntWithDefault(EMAIL_QUEUE_RATE_LIMIT_MAX_DEFAULT),
  queueRateLimitDurationMs: positiveIntWithDefault(EMAIL_QUEUE_RATE_LIMIT_DURATION_MS_DEFAULT),
  queueRemoveOnComplete: positiveIntWithDefault(EMAIL_QUEUE_REMOVE_ON_COMPLETE_DEFAULT),
  queueRemoveOnFail: positiveIntWithDefault(EMAIL_QUEUE_REMOVE_ON_FAIL_DEFAULT),
});

export function resolveEmailRuntimeConfig(configService: Pick<ConfigService, 'get'>): EmailRuntimeConfig {
  const raw = rawEmailConfigSchema.parse({
    nodeEnv: configService.get('NODE_ENV'),
    appEnv: configService.get('APP_ENV'),
    smtpHost: configService.get('SMTP_HOST'),
    smtpPort: configService.get('SMTP_PORT'),
    smtpUser: configService.get('SMTP_USER'),
    smtpPass: configService.get('SMTP_PASS'),
    smtpSecureRaw: configService.get('SMTP_SECURE'),
    fromAddress: configService.get('EMAIL_FROM_ADDRESS'),
    fromName: configService.get('EMAIL_FROM_NAME'),
    redisUrl: configService.get('REDIS_URL'),
    allowedDomains: configService.get('EMAIL_ALLOWED_DOMAINS'),
    blockedDomains: configService.get('EMAIL_BLOCKED_DOMAINS'),
    queueConcurrency: configService.get('EMAIL_QUEUE_CONCURRENCY'),
    queueRateLimitMax: configService.get('EMAIL_QUEUE_RATE_LIMIT_MAX'),
    queueRateLimitDurationMs: configService.get('EMAIL_QUEUE_RATE_LIMIT_DURATION_MS'),
    queueRemoveOnComplete: configService.get('EMAIL_QUEUE_REMOVE_ON_COMPLETE'),
    queueRemoveOnFail: configService.get('EMAIL_QUEUE_REMOVE_ON_FAIL'),
  });

  const normalizedSecure = raw.smtpSecureRaw.toLowerCase();
  const smtpSecure =
    normalizedSecure === 'true' ||
    normalizedSecure === '1' ||
    normalizedSecure === 'yes' ||
    normalizedSecure === 'on'
      ? true
      : normalizedSecure === 'false' ||
          normalizedSecure === '0' ||
          normalizedSecure === 'no' ||
          normalizedSecure === 'off'
        ? false
        : raw.smtpPort === 465;

  const smtpEnabled =
    raw.smtpHost.length > 0 &&
    raw.smtpUser.length > 0 &&
    raw.smtpPass.length > 0 &&
    raw.fromAddress.length > 0;

  const queueEnabled = raw.redisUrl.length > 0;
  const isLocalhost = raw.appEnv === 'localhost';
  const isProductionLike = !['development', 'test'].includes(raw.nodeEnv) && !isLocalhost;

  if (isProductionLike && !smtpEnabled) {
    throw new Error(
      'Email SMTP config is required in non-development environments. Set SMTP_HOST/SMTP_USER/SMTP_PASS.',
    );
  }

  if (isProductionLike && !queueEnabled) {
    throw new Error(
      'REDIS_URL is required for queued email delivery in non-development environments.',
    );
  }

  return {
    smtpHost: raw.smtpHost,
    smtpPort: raw.smtpPort,
    smtpUser: raw.smtpUser,
    smtpPass: raw.smtpPass,
    smtpSecure,
    fromAddress: raw.fromAddress,
    fromName: raw.fromName,
    redisUrl: raw.redisUrl,
    smtpEnabled,
    queueEnabled,
    queueConcurrency: raw.queueConcurrency,
    queueRateLimitMax: raw.queueRateLimitMax,
    queueRateLimitDurationMs: raw.queueRateLimitDurationMs,
    queueRemoveOnComplete: raw.queueRemoveOnComplete,
    queueRemoveOnFail: raw.queueRemoveOnFail,
    isLocalhost,
    isProductionLike,
    allowedDomains: raw.allowedDomains,
    blockedDomains: raw.blockedDomains,
  };
}

@Injectable()
export class EmailConfigService {
  readonly runtime: EmailRuntimeConfig;

  constructor(configService: ConfigService) {
    this.runtime = resolveEmailRuntimeConfig(configService);
  }
}
