import { Controller, Get, Query } from '@nestjs/common';

import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { ListEnvironmentsDto } from '../dto/list-environments.dto';
import { AdminEnvironmentsService } from '../services/admin-environments.service';

@Controller('admin/environments')
@RequirePermissions('admin.access', 'admin.environments.read')
export class AdminEnvironmentsController {
  constructor(private readonly envs: AdminEnvironmentsService) {}

  @Get()
  async list(@Query() q: ListEnvironmentsDto) {
    return this.envs.list({ q: q.q, page: q.page, pageSize: q.pageSize });
  }
}

