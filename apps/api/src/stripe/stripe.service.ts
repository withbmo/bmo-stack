import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe | null;
  private readonly isDev: boolean;

  constructor(private readonly configService: ConfigService) {
    const secretKey = (this.configService.get<string>('STRIPE_SECRET_KEY') ?? '').trim();
    const apiVersion = ((this.configService.get<string>('STRIPE_API_VERSION') ?? '').trim() ||
      '2026-01-28.clover') as Stripe.LatestApiVersion;
    const nodeEnv = (this.configService.get<string>('NODE_ENV') ?? process.env.NODE_ENV) ?? 'development';
    this.isDev = nodeEnv !== 'production';

    this.stripe = secretKey
      ? new Stripe(secretKey, {
          apiVersion,
          typescript: true,
        })
      : null;
  }

  isConfigured(): boolean {
    return this.stripe !== null;
  }

  client(): Stripe {
    if (!this.stripe) {
      if (this.isDev) {
        // In dev mode, throw gracefully so the caller can decide how to handle
        throw new ServiceUnavailableException({
          code: 'STRIPE_NOT_CONFIGURED',
          detail: 'Stripe is not configured. Set STRIPE_SECRET_KEY to use billing features.',
        });
      }
      // In production, require configuration
      throw new ServiceUnavailableException({
        code: 'STRIPE_NOT_CONFIGURED',
        detail: 'Stripe is not configured. Set STRIPE_SECRET_KEY.',
      });
    }
    return this.stripe;
  }

  webhookSecret(): string {
    const secrets = this.webhookSecrets();
    return secrets[0]!;
  }

  webhookSecrets(): string[] {
    const raw = (this.configService.get<string>('STRIPE_WEBHOOK_SECRET') ?? '').trim();
    const secrets = raw
      .split(/[\n,]/g)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    // In dev mode, allow a fallback dev secret for local testing with stripe listen
    if (this.isDev && secrets.length === 0) {
      return ['dev-webhook-secret'];
    }

    if (secrets.length === 0) {
      throw new ServiceUnavailableException({
        code: 'STRIPE_WEBHOOK_NOT_CONFIGURED',
        detail: 'Stripe webhook verification is not configured. Set STRIPE_WEBHOOK_SECRET.',
      });
    }
    return secrets;
  }
}
