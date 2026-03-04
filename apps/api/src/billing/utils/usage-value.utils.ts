import { BadRequestException } from '@nestjs/common';

import { BILLING_ERROR_CODE } from '../billing-error-codes';
import { type BillableEvent } from '../billing.interface';

function readNumericProperty(
  properties: Record<string, number | string>,
  key: string,
  eventName: BillableEvent
): number {
  const raw = properties[key];
  const value = typeof raw === 'number' ? raw : Number(raw);
  if (!Number.isFinite(value) || value < 0) {
    throw new BadRequestException({
      code: BILLING_ERROR_CODE.BILLING_USAGE_VALUE_INVALID,
      detail: `Usage property "${key}" must be a non-negative number for ${eventName}.`,
    });
  }
  return Math.round(value);
}

export function toMeterValue(
  eventName: BillableEvent,
  properties: Record<string, number | string>
): number {
  if (eventName === 'ec2_minutes') return readNumericProperty(properties, 'minutes', eventName);
  if (eventName === 'ai_tokens') return readNumericProperty(properties, 'tokens', eventName);
  if (eventName === 'nat_gb') return readNumericProperty(properties, 'gb', eventName);
  throw new BadRequestException({
    code: BILLING_ERROR_CODE.BILLING_USAGE_VALUE_INVALID,
    detail: `Unsupported billable event: ${eventName}.`,
  });
}
