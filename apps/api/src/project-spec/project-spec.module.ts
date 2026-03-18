import { Module } from '@nestjs/common';

import { ProjectSpecService } from './project-spec.service.js';

@Module({
  providers: [ProjectSpecService],
  exports: [ProjectSpecService],
})
export class ProjectSpecModule {}
