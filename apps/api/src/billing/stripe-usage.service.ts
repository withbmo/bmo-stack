import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';

import { StripeService } from '../stripe/stripe.service';
import { BILLING_ERROR_CODE } from './billing-error-codes';
import type { UsageEvent } from './billing.interface';

function centsToUsdString(cents: number): string {
  if (!Number.isFinite(cents)) return '0.00';
  return (cents / 100).toFixed(2);
}

@Injectable()
export class StripeUsageService {
  private readonly logger = new Logger(StripeUsageService.name);

  constructor(private readonly stripeService: StripeService) {}

  async reportUsage(event: UsageEvent): Promise<void> {
    const value = Math.max(0, Math.round(Number(event.value)));
    if (!Number.isFinite(value)) {
      throw new ServiceUnavailableException({
        code: BILLING_ERROR_CODE.BILLING_USAGE_VALUE_INVALID,
        detail: 'Usage value must be a finite number.',
      });
    }

    const stripe = this.stripeService.client();
    try {
      await stripe.billing.meterEvents.create({
        event_name: event.eventName,
        payload: {
          stripe_customer_id: event.stripeCustomerId,
          value: String(value),
        },
        identifier: event.idempotencyKey,
        timestamp: event.timestamp ? Math.floor(event.timestamp.getTime() / 1000) : undefined,
      });
    } catch (err) {
      this.logger.error('stripe_meter_event_failed', {
        eventName: event.eventName,
        stripeCustomerId: event.stripeCustomerId,
        idempotencyKey: event.idempotencyKey,
        error: err instanceof Error ? err.message : String(err),
      });
      throw new ServiceUnavailableException({
        code: BILLING_ERROR_CODE.BILLING_ENGINE_ERROR,
        detail: 'Failed to report usage to Stripe.',
      });
    }
  }

  async grantCredits(input: {
    stripeCustomerId: string;
    amountUsd: number;
    idempotencyKey: string;
    expiresAt?: Date;
  }): Promise<void> {
    const amountCents = Math.round(Number(input.amountUsd) * 100);
    if (!Number.isFinite(amountCents) || amountCents <= 0) {
      throw new ServiceUnavailableException({
        code: BILLING_ERROR_CODE.BILLING_INVALID_AMOUNT,
        detail: 'Credit amount must be positive.',
      });
    }

    const stripe = this.stripeService.client();
    try {
      await stripe.billing.creditGrants.create(
        {
          customer: input.stripeCustomerId,
          amount: {
            type: 'monetary',
            monetary: { currency: 'usd', value: amountCents },
          },
          applicability_config: {
            scope: {
              price_type: 'metered',
            },
          },
          category: 'paid',
          expires_at: input.expiresAt ? Math.floor(input.expiresAt.getTime() / 1000) : undefined,
          metadata: { idempotencyKey: input.idempotencyKey },
        },
        { idempotencyKey: `credit_grant:${input.idempotencyKey}` }
      );
    } catch (err) {
      this.logger.error('stripe_credit_grant_failed', {
        stripeCustomerId: input.stripeCustomerId,
        amountUsd: input.amountUsd,
        idempotencyKey: input.idempotencyKey,
        error: err instanceof Error ? err.message : String(err),
      });
      throw new ServiceUnavailableException({
        code: BILLING_ERROR_CODE.BILLING_ENGINE_ERROR,
        detail: 'Failed to grant credits in Stripe.',
      });
    }
  }

  async getCreditBalance(stripeCustomerId: string): Promise<{ amount: string; currency: 'USD' }> {
    const stripe = this.stripeService.client();
    try {
      const summary = await stripe.billing.creditBalanceSummary.retrieve({
        customer: stripeCustomerId,
        filter: {
          type: 'applicability_scope',
          applicability_scope: { price_type: 'metered' },
        },
      });
      const availableUsdCents = summary.balances.reduce((sum, balance) => {
        const monetary = balance.available_balance.monetary;
        if (!monetary) return sum;
        if (monetary.currency.toLowerCase() !== 'usd') return sum;
        return sum + (monetary.value ?? 0);
      }, 0);
      return { amount: centsToUsdString(availableUsdCents), currency: 'USD' };
    } catch (err) {
      this.logger.error('stripe_credit_balance_failed', {
        stripeCustomerId,
        error: err instanceof Error ? err.message : String(err),
      });
      throw new ServiceUnavailableException({
        code: BILLING_ERROR_CODE.BILLING_ENGINE_ERROR,
        detail: 'Failed to retrieve Stripe credit balance.',
      });
    }
  }
}
