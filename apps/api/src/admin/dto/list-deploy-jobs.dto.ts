import { IsIn, IsOptional, IsString } from 'class-validator';
import { DEPLOY_JOB_STATUS } from '@pytholit/contracts';

import { PaginationDto } from './pagination.dto';

const DEPLOY_JOB_STATUSES = Object.values(DEPLOY_JOB_STATUS) as [string, ...string[]];

export class ListDeployJobsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @IsIn(DEPLOY_JOB_STATUSES)
  status?: (typeof DEPLOY_JOB_STATUS)[keyof typeof DEPLOY_JOB_STATUS];
}

