import {
  BILLING_INTERVALS,
  type BillingInterval,
  PAID_PLAN_IDS,
  type PaidPlanId,
} from '@pytholit/contracts';
import { IsIn, IsString } from 'class-validator';

/**
 * Data Transfer Object for creating a Stripe checkout session.
 * Used in POST /billing/checkout to initiate a subscription to a paid plan.
 * @see BillingController.checkout
 */
export class CreateCheckoutSessionDto {
  /**
   * The paid plan ID to subscribe to.
   * Accepted values: 'pro' | 'max'
   * @see PAID_PLAN_IDS
   */
  @IsString()
  @IsIn(PAID_PLAN_IDS)
  planId!: PaidPlanId;

  /**
   * The billing interval for the subscription.
   * Accepted values: 'month' | 'year'
   * @see BILLING_INTERVALS
   */
  @IsIn(BILLING_INTERVALS)
  interval!: BillingInterval;
}
