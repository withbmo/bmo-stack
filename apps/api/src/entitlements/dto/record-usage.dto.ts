import { IsNumber, IsString, Min, MinLength } from 'class-validator';

export class RecordEntitlementUsageDto {
  @IsString()
  @MinLength(1)
  featureId!: string;

  @IsNumber()
  @Min(1)
  amount!: number;
}
