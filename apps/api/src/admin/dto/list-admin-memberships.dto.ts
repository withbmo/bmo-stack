import { IsOptional, IsString, MaxLength } from 'class-validator';

import { PaginationDto } from './pagination.dto';

export class ListAdminMembershipsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  q?: string;
}
