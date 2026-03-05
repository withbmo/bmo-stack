import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type Stripe from 'stripe';

import { StripeService } from '../stripe/stripe.service';
import { BILLING_ERROR_CODE } from './billing-error-codes';
import { StripeCustomerService } from './stripe-customer.service';

@Injectable()
export class StripeContextService {
  constructor(
    private readonly config: ConfigService,
    private readonly stripeService: StripeService,
    private readonly stripeCustomers: StripeCustomerService
  ) {}

  /** Returns shared Stripe context for user-scoped billing actions. */
  async getStripeContextForUser(
    userId: string
  ): Promise<{ stripe: Stripe; stripeCustomerId: string }> {
    const stripeCustomerId = await this.stripeCustomers.getOrCreateStripeCustomerIdForUser(userId);
    return { stripe: this.stripeService.client(), stripeCustomerId };
  }

  /** Returns newest Stripe subscription for customer, or `null` if none exists. */
  async getLatestStripeSubscription(
    stripe: Stripe,
    stripeCustomerId: string
  ): Promise<Stripe.Subscription | null> {
    const statusPriority: Record<string, number> = {
      active: 0,
      trialing: 1,
      past_due: 2,
      unpaid: 3,
      incomplete: 4,
      paused: 5,
      canceled: 6,
      incomplete_expired: 7,
    };

    const subs = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'all',
      limit: 20,
    });
    const sorted = [...subs.data].sort((a, b) => {
      const aPriority = statusPriority[a.status] ?? 99;
      const bPriority = statusPriority[b.status] ?? 99;
      if (aPriority !== bPriority) return aPriority - bPriority;
      return (b.created ?? 0) - (a.created ?? 0);
    });
    return sorted[0] ?? null;
  }

  /** Resolves and validates `FRONTEND_URL` used by Stripe redirect flows. */
  requireFrontendUrl(): string {
    const url = (this.config.get<string>('FRONTEND_URL') ?? '').trim();
    if (!url) {
      throw new ServiceUnavailableException({
        code: BILLING_ERROR_CODE.FRONTEND_URL_NOT_CONFIGURED,
        detail: 'FRONTEND_URL is required for Stripe redirects.',
      });
    }
    return url.replace(/\/+$/, '');
  }
}
