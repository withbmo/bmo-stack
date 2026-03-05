import { Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

import { BILLABLE_EVENTS, type BillableEvent } from '../billing.interface';

/** Required property key per billable event name. */
const EVENT_PROPERTY_KEY: Record<BillableEvent, string> = {
  ec2_minutes: 'minutes',
  ai_tokens: 'tokens',
  nat_gb: 'gb',
};

function HasRequiredUsageProperty(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'hasRequiredUsageProperty',
      target: (object as { constructor: new (...args: unknown[]) => unknown }).constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          const dto = args.object as { eventName?: BillableEvent };
          const requiredKey = dto.eventName ? EVENT_PROPERTY_KEY[dto.eventName] : undefined;
          if (!requiredKey) return false;
          if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
          const raw = (value as Record<string, unknown>)[requiredKey];
          const num = typeof raw === 'number' ? raw : Number(raw);
          return Number.isFinite(num) && num >= 0;
        },
        defaultMessage(args: ValidationArguments) {
          const dto = args.object as { eventName?: BillableEvent };
          const requiredKey = dto.eventName ? EVENT_PROPERTY_KEY[dto.eventName] : '<unknown>';
          return `properties must contain a non-negative number for key "${requiredKey}" (required by eventName "${dto.eventName ?? ''}").`;
        },
      },
    });
  };
}

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

  /**
   * Numeric/string dimensions required by the event type:
   * - ec2_minutes: { minutes: number }
   * - ai_tokens:   { tokens: number }
   * - nat_gb:      { gb: number }
   */
  @HasRequiredUsageProperty()
  properties!: Record<string, number | string>;

  /** UTC timestamp when usage occurred. Defaults to now if omitted. */
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  timestamp?: Date;
}
