import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { FRONTEND_URL_DEFAULT } from '../config/defaults';

const LAGO_ROLLOUT_MIN = 0;
const LAGO_ROLLOUT_MAX = 100;

/**
 * Centralized billing configuration. Single source of truth for FRONTEND_URL,
 * STRIPE_WEBHOOK_SECRET, and STRIPE_SECRET_KEY used by billing module.
 */
@Injectable()
export class BillingConfigService {
  readonly frontendUrl: string;
  readonly webhookSecret: string | undefined;
  readonly stripeSecretKey: string | undefined;
  readonly lagoApiUrl: string | undefined;
  readonly lagoApiKey: string | undefined;
  readonly lagoWebhookSecret: string | undefined;
  readonly lagoOrganizationId: string | undefined;
  readonly lagoRolloutPercent: number;

  constructor(configService: ConfigService) {
    this.frontendUrl = configService.get<string>('FRONTEND_URL')?.trim() || FRONTEND_URL_DEFAULT;
    this.webhookSecret = configService.get<string>('STRIPE_WEBHOOK_SECRET')?.trim() || undefined;
    this.stripeSecretKey = configService.get<string>('STRIPE_SECRET_KEY')?.trim() || undefined;
    this.lagoApiUrl = configService.get<string>('LAGO_API_URL')?.trim() || undefined;
    this.lagoApiKey = configService.get<string>('LAGO_API_KEY')?.trim() || undefined;
    this.lagoWebhookSecret = configService.get<string>('LAGO_WEBHOOK_SECRET')?.trim() || undefined;
    this.lagoOrganizationId =
      configService.get<string>('LAGO_ORGANIZATION_ID')?.trim() || undefined;
    this.lagoRolloutPercent = this.normalizeRolloutPercent(
      configService.get<number>('LAGO_ROLLOUT_PERCENT')
    );
  }

  get lagoEnabled(): boolean {
    return Boolean(this.lagoApiUrl && this.lagoApiKey);
  }

  shouldUseLago(userId: string): boolean {
    if (!this.lagoEnabled) {
      return false;
    }

    if (this.lagoRolloutPercent >= LAGO_ROLLOUT_MAX) {
      return true;
    }

    if (this.lagoRolloutPercent <= LAGO_ROLLOUT_MIN) {
      return false;
    }

    const bucket = this.hashToPercent(userId);
    return bucket < this.lagoRolloutPercent;
  }

  private normalizeRolloutPercent(value: number | undefined): number {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      return LAGO_ROLLOUT_MIN;
    }

    return Math.min(LAGO_ROLLOUT_MAX, Math.max(LAGO_ROLLOUT_MIN, Math.floor(value)));
  }

  private hashToPercent(value: string): number {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
      hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
    }
    return hash % 100;
  }
}
