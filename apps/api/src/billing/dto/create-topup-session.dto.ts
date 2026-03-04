import { IsIn, IsInt } from 'class-validator';

/** Predefined credit top-up amounts in USD. */
const TOPUP_PRESETS_USD = [10, 25, 50, 100] as const;

/** Valid top-up preset amounts in USD. */
export type TopupPresetUsd = (typeof TOPUP_PRESETS_USD)[number];

/**
 * Data Transfer Object for creating a credit top-up checkout session.
 * Used in POST /billing/topup to purchase additional credits.
 * @see BillingController.topup
 */
export class CreateTopupSessionDto {
  /**
   * The top-up amount in USD.
   * Accepted values: 10 | 25 | 50 | 100
   * @see TOPUP_PRESETS_USD
   */
  @IsInt()
  @IsIn(TOPUP_PRESETS_USD)
  amountUsd!: TopupPresetUsd;
}

