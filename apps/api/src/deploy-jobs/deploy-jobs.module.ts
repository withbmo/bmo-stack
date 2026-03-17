import { Module } from '@nestjs/common';

import { ProjectsModule } from '../projects/projects.module.js';
import { DeployJobsController } from './deploy-jobs.controller.js';
import { DeployJobsService } from './deploy-jobs.service.js';

@Module({
  imports: [ProjectsModule],
  controllers: [DeployJobsController],
  providers: [DeployJobsService],
  exports: [DeployJobsService],
})
export class DeployJobsModule {}
