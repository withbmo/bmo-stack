import { Module } from '@nestjs/common';
import { DeployJobsController } from './deploy-jobs.controller';
import { DeployJobsService } from './deploy-jobs.service';
import { ProjectsModule } from '../projects/projects.module';
import { EnvironmentsModule } from '../environments/environments.module';

@Module({
  imports: [ProjectsModule, EnvironmentsModule],
  controllers: [DeployJobsController],
  providers: [DeployJobsService],
  exports: [DeployJobsService],
})
export class DeployJobsModule {}
