import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { BILLABLE_EVENTS, type BillableEvent } from '../billing.interface';

export class UpdateUsageEventLimitDto {
  @IsIn(BILLABLE_EVENTS)
  eventName!: BillableEvent;

  @IsBoolean()
  unlimited!: boolean;

  @ValidateIf(value => !value.unlimited)
  @IsOptional()
  @IsInt()
  @Min(0)
  maxCredits?: number;
}

export class UpdateUsageSettingsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdateUsageEventLimitDto)
  events!: UpdateUsageEventLimitDto[];
}
