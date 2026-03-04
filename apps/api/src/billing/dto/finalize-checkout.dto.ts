import { PAID_PLAN_IDS, type PaidPlanId } from '@pytholit/contracts';
import { IsIn, IsString } from 'class-validator';

/**
 * Data Transfer Object for finalizing a checkout session.
 * Used in POST /billing/checkout/finalize to complete a subscription after payment setup.
 * @see BillingController.finalize
 */
export class FinalizeCheckoutDto {
  /**
   * The pending paid plan code to activate.
   * Accepted values: 'pro' | 'max'
   * @see PAID_PLAN_IDS
   */
  @IsString()
  @IsIn(PAID_PLAN_IDS)
  pendingPlanCode!: PaidPlanId;
}
