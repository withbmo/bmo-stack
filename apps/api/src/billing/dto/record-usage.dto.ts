import { IsNumber, IsString, Min, MinLength } from 'class-validator';

export class RecordUsageDto {
  @IsString()
  @MinLength(1)
  metricName!: string;

  @IsNumber()
  @Min(1)
  value!: number;

  @IsString()
  @MinLength(1)
  operationId!: string;
}
