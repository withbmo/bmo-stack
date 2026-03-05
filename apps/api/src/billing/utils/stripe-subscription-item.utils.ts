import { ConflictException } from '@nestjs/common';
import { BILLING_INTERVALS, type BillingInterval } from '@pytholit/contracts';
import type Stripe from 'stripe';

import { BILLING_ERROR_CODE } from '../billing-error-codes';

export type StripeSubscriptionWithPeriods = Stripe.Subscription & {
  current_period_start?: number;
  current_period_end?: number;
  cancel_at_period_end?: boolean;
  cancel_at?: number | null;
  canceled_at?: number | null;
};

export function pickPlanSubscriptionItem(subscription: Stripe.Subscription): {
  priceId: string;
  interval: BillingInterval;
  currentPeriodStart: number | null;
  currentPeriodEnd: number | null;
} | null {
  const items = subscription.items?.data ?? [];
  for (const item of items) {
    const price = item?.price ?? null;
    const priceId = price?.id ?? null;
    const interval = price?.recurring?.interval ?? null;
    if (!priceId) {
      throw new ConflictException({
        code: BILLING_ERROR_CODE.BILLING_STRIPE_SUBSCRIPTION_ITEM_INVALID,
        detail: 'Subscription item is missing Stripe price id.',
      });
    }
    if (!interval || !BILLING_INTERVALS.includes(interval as BillingInterval)) {
      throw new ConflictException({
        code: BILLING_ERROR_CODE.BILLING_STRIPE_SUBSCRIPTION_ITEM_INVALID,
        detail: `Subscription item has invalid interval "${String(interval)}".`,
      });
    }
    const billingInterval = interval as BillingInterval;
    return {
      priceId,
      interval: billingInterval,
      currentPeriodStart:
        typeof item?.current_period_start === 'number' ? item.current_period_start : null,
      currentPeriodEnd:
        typeof item?.current_period_end === 'number' ? item.current_period_end : null,
    };
  }
  return null;
}
