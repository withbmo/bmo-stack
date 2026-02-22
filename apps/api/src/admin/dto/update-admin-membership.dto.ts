import { ADMIN_LEVELS, type AdminLevel } from '@pytholit/contracts';
import { IsIn, IsString } from 'class-validator';

export class UpdateAdminMembershipDto {
  @IsString()
  @IsIn(ADMIN_LEVELS as unknown as string[])
  level!: AdminLevel;
}
