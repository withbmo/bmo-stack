import { Controller, Get, Query } from '@nestjs/common';
import { UseAbility } from 'nest-casl';

import { EnvironmentSubject } from '../../auth-admin/casl/subjects';
import { ListEnvironmentsDto } from '../dto/list-environments.dto';
import { AdminEnvironmentsService } from '../services/admin-environments.service';

@Controller('admin/environments')
@UseAbility('read', EnvironmentSubject) // Replaces ADMIN_ENVIRONMENTS_READ
export class AdminEnvironmentsController {
  constructor(private readonly envs: AdminEnvironmentsService) {}

  @Get()
  async list(@Query() q: ListEnvironmentsDto) {
    return this.envs.list({ q: q.q, page: q.page, pageSize: q.pageSize });
  }
}
