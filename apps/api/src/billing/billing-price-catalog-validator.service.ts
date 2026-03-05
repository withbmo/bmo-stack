import { Injectable, Logger, OnModuleInit, ServiceUnavailableException } from '@nestjs/common';
import { BILLING_INTERVAL, PAID_PLAN_IDS } from '@pytholit/contracts';

import { StripeService } from '../stripe/stripe.service';
import { BILLING_ERROR_CODE } from './billing-error-codes';
import { buildBillingPlanCode } from './billing-plan-code';

@Injectable()
export class BillingPriceCatalogValidatorService implements OnModuleInit {
  private readonly logger = new Logger(BillingPriceCatalogValidatorService.name);

  constructor(private readonly stripeService: StripeService) {}

  async onModuleInit(): Promise<void> {
    if (!this.stripeService.isConfigured()) {
      this.logger.warn('Skipping Stripe price catalog validation: Stripe is not configured.');
      return;
    }

    const expected = PAID_PLAN_IDS.flatMap(planId => [
      { planId, interval: BILLING_INTERVAL.MONTH, lookupKey: buildBillingPlanCode(planId, BILLING_INTERVAL.MONTH) },
      { planId, interval: BILLING_INTERVAL.YEAR, lookupKey: buildBillingPlanCode(planId, BILLING_INTERVAL.YEAR) },
    ]);

    const lookupKeys = expected.map(item => item.lookupKey);
    const stripe = this.stripeService.client();
    const prices = await stripe.prices.list({
      lookup_keys: lookupKeys,
      active: true,
      limit: Math.max(10, lookupKeys.length * 3),
    });

    const missing = expected.filter(item => {
      return !prices.data.some(price => {
        if (price.lookup_key !== item.lookupKey) return false;
        if (price.currency.toLowerCase() !== 'usd') return false;
        if (!price.recurring) return false;
        return price.recurring.interval === item.interval;
      });
    });

    if (missing.length === 0) {
      this.logger.log(`Stripe price catalog validation passed (${lookupKeys.join(', ')}).`);
      return;
    }

    const detail = `Missing active recurring USD Stripe price(s): ${missing
      .map(item => `${item.lookupKey}(${item.interval})`)
      .join(', ')}`;

    this.logger.error(detail);
    throw new ServiceUnavailableException({
      code: BILLING_ERROR_CODE.BILLING_STRIPE_PRICE_CATALOG_INCOMPLETE,
      detail,
    });
  }
}
