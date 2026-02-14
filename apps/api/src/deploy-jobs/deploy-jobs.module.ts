import { Module } from '@nestjs/common';

import { EnvironmentsModule } from '../environments/environments.module';
import { ProjectsModule } from '../projects/projects.module';
import { DeployJobsController } from './deploy-jobs.controller';
import { DeployJobsService } from './deploy-jobs.service';

@Module({
  imports: [ProjectsModule, EnvironmentsModule],
  controllers: [DeployJobsController],
  providers: [DeployJobsService],
  exports: [DeployJobsService],
})
export class DeployJobsModule {}
