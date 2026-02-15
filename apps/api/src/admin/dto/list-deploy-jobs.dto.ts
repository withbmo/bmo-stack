import { IsIn, IsOptional, IsString } from 'class-validator';

import { PaginationDto } from './pagination.dto';

const STATUSES = ['queued', 'running', 'succeeded', 'failed', 'canceled'] as const;

export class ListDeployJobsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @IsIn(STATUSES as unknown as string[])
  status?: (typeof STATUSES)[number];
}

