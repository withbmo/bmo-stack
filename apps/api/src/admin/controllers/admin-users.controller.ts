import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { ListUsersDto } from '../dto/list-users.dto';
import { UpdateAdminUserDto } from '../dto/update-admin-user.dto';
import { AdminUsersService } from '../services/admin-users.service';

@Controller('admin/users')
@RequirePermissions('admin.access', 'admin.users.read')
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
  @RequirePermissions('admin.access', 'admin.users.write')
  async patch(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() body: UpdateAdminUserDto
  ) {
    return this.users.updateUser(user.id, id, body);
  }
}

