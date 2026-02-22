import { IsIn, IsString, MinLength } from 'class-validator';

export class PlanChangeApplyDto {
  @IsString()
  @MinLength(1)
  targetPlanId!: string;

  @IsIn(['month', 'year'])
  targetInterval!: 'month' | 'year';

  @IsString()
  @MinLength(1)
  previewId!: string;
}
