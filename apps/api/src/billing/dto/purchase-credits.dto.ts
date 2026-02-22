import { IsInt, Max, Min } from 'class-validator';

export class PurchaseCreditsDto {
  @IsInt()
  @Min(1)
  @Max(10000)
  amount!: number;
}
