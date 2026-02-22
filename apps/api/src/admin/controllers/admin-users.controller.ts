import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { UseAbility } from 'nest-casl';

import { UserSubject } from '../../auth-admin/casl/subjects';
import { CurrentAdmin, type AdminAuthenticatedUser } from '../../auth-admin/decorators/current-admin.decorator';
import { ListUsersDto } from '../dto/list-users.dto';
import { UpdateAdminUserDto } from '../dto/update-admin-user.dto';
import { AdminUsersService } from '../services/admin-users.service';

@Controller('admin/users')
@UseAbility('read', UserSubject) // Replaces ADMIN_USERS_READ
export class AdminUsersController {
  constructor(private readonly users: AdminUsersService) {}

  @Get()
  async list(@Query() q: ListUsersDto) {
    return this.users.list({ q: q.q, page: q.page, pageSize: q.pageSize });
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.users.findById(id);
  }

  @Patch(':id')
  @UseAbility('update', UserSubject) // Replaces ADMIN_USERS_WRITE
  async patch(
    @CurrentAdmin() user: AdminAuthenticatedUser,
    @Param('id') id: string,
    @Body() body: UpdateAdminUserDto
  ) {
    return this.users.updateUser(user.id, id, body);
  }
}
