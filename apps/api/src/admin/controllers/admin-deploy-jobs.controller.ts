import { Controller, Get, Param, Post, Query } from '@nestjs/common';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RequirePermissions } from '../../auth/decorators/require-permissions.decorator';
import { ListDeployJobsDto } from '../dto/list-deploy-jobs.dto';
import { AdminDeployJobsService } from '../services/admin-deploy-jobs.service';

@Controller('admin/deploy-jobs')
@RequirePermissions('admin.access', 'admin.deployJobs.read')
export class AdminDeployJobsController {
  constructor(private readonly jobs: AdminDeployJobsService) {}

  @Get()
  async list(@Query() q: ListDeployJobsDto) {
    return this.jobs.list({ status: q.status, page: q.page, pageSize: q.pageSize });
  }

  @Post(':id/cancel')
  @RequirePermissions('admin.access', 'admin.deployJobs.write')
  async cancel(@CurrentUser() user: any, @Param('id') id: string) {
    return this.jobs.cancel(user.id, id);
  }
}

