import { IsOptional, IsString, MaxLength } from 'class-validator';

import { PaginationDto } from './pagination.dto';

export class ListUsersDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  q?: string;
}

