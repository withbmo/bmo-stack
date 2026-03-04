import { IsDateString, IsIn, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

import { BILLABLE_EVENTS, type BillableEvent } from '../billing.interface';

/**
 * POST /billing/usage/report
 * Ingest a raw usage event into Stripe billing meters.
 */
export class ReportUsageDto {
  /**
   * The user whose wallet will be charged.
   * This endpoint is internal-only and must be called by trusted backend services.
   */
  @IsString()
  userId!: string;

  /** Idempotency key — prevents double-billing on retries. */
  @IsString()
  @MaxLength(200)
  idempotencyKey!: string;

  /** Billable metric name — must be a known event type. */
  @IsIn(BILLABLE_EVENTS)
  eventName!: BillableEvent;

  /** Numeric/string dimensions, e.g. { minutes: 60 } or { input_tokens: 1500 }. */
  @IsObject()
  properties!: Record<string, number | string>;

  /** ISO 8601 UTC timestamp when usage occurred. Defaults to now if omitted. */
  @IsOptional()
  @IsDateString()
  timestamp?: string;
}
