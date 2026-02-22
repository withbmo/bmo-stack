import { IsString, MaxLength, MinLength } from 'class-validator';

export class RetryCreditTopupDto {
  @IsString()
  @MinLength(1)
  @MaxLength(191)
  lagoInvoiceId!: string;
}
