import { IsIn, IsOptional } from 'class-validator';

export class ListProjectsDto {
  @IsOptional()
  @IsIn(['active', 'archived', 'all'])
  state?: 'active' | 'archived' | 'all';
}
