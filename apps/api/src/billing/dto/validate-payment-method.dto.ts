import { IsString, MinLength } from 'class-validator';

export class ValidatePaymentMethodDto {
  @IsString()
  @MinLength(1)
  paymentMethodId!: string;
}

