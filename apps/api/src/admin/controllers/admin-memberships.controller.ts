import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UseAbility } from 'nest-casl';

import { AdminMembershipSubject } from '../../auth-admin/casl/subjects';
import { CurrentAdmin, type AdminAuthenticatedUser } from '../../auth-admin/decorators/current-admin.decorator';
import { CreateAdminMembershipDto } from '../dto/create-admin-membership.dto';
import { ListAdminMembershipsDto } from '../dto/list-admin-memberships.dto';
import { UpdateAdminMembershipDto } from '../dto/update-admin-membership.dto';
import { AdminMembershipsService } from '../services/admin-memberships.service';

@Controller('admin/admins')
@UseAbility('manage', AdminMembershipSubject)
export class AdminMembershipsController {
  constructor(private readonly memberships: AdminMembershipsService) {}

  @Get()
  async list(@Query() q: ListAdminMembershipsDto) {
    return this.memberships.list({ q: q.q, page: q.page, pageSize: q.pageSize });
  }

  @Post()
  async grant(@CurrentAdmin() user: AdminAuthenticatedUser, @Body() body: CreateAdminMembershipDto) {
    return this.memberships.grant(user.id, body.userId, body.level);
  }

  @Patch(':userId')
  async patch(
    @CurrentAdmin() user: AdminAuthenticatedUser,
    @Param('userId') userId: string,
    @Body() body: UpdateAdminMembershipDto
  ) {
    return this.memberships.updateLevel(user.id, userId, body.level);
  }

  @Delete(':userId')
  async revoke(@CurrentAdmin() user: AdminAuthenticatedUser, @Param('userId') userId: string) {
    return this.memberships.revoke(user.id, userId);
  }
}
