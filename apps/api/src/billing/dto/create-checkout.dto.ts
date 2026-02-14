import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCheckoutDto {
  @IsString()
  @MinLength(1)
  planId!: string;

  @IsOptional()
  @IsIn(['month', 'year'])
  interval?: 'month' | 'year';
}

