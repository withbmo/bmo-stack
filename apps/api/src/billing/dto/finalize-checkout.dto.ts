import { IsString, MinLength } from 'class-validator';

export class FinalizeCheckoutDto {
  @IsString()
  @MinLength(1)
  pendingPlanCode!: string;
}
