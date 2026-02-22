import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UseAbility } from 'nest-casl';

import { DeployJobSubject } from '../../auth-admin/casl/subjects';
import { CurrentAdmin, type AdminAuthenticatedUser } from '../../auth-admin/decorators/current-admin.decorator';
import { ListDeployJobsDto } from '../dto/list-deploy-jobs.dto';
import { AdminDeployJobsService } from '../services/admin-deploy-jobs.service';

@Controller('admin/deploy-jobs')
@UseAbility('read', DeployJobSubject) // Replaces ADMIN_DEPLOY_JOBS_READ
export class AdminDeployJobsController {
  constructor(private readonly jobs: AdminDeployJobsService) {}

  @Get()
  async list(@Query() q: ListDeployJobsDto) {
    return this.jobs.list({ status: q.status, page: q.page, pageSize: q.pageSize });
  }

  @Post(':id/cancel')
  @UseAbility('update', DeployJobSubject) // Replaces ADMIN_DEPLOY_JOBS_WRITE (cancel is an update operation)
  async cancel(@CurrentAdmin() user: AdminAuthenticatedUser, @Param('id') id: string) {
    return this.jobs.cancel(user.id, id);
  }
}
