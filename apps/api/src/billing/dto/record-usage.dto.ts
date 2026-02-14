import { IsNumber, IsString, MinLength } from 'class-validator';

export class RecordUsageDto {
  @IsString()
  @MinLength(1)
  metricName!: string;

  @IsNumber()
  value!: number;
}

