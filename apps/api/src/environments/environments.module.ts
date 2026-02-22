import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { EnvironmentsConfigService } from './environments.config';
import { EnvironmentsController } from './environments.controller';
import { EnvironmentsService } from './environments.service';
import { EnvironmentsCrudService } from './services/environments-crud.service';
import { EnvironmentsLifecycleService } from './services/environments-lifecycle.service';
import { TerminalTmuxCleanupService } from './terminal-tmux-cleanup.service';

/**
 * Exposes the environments REST API and business logic.
 * Registers EnvironmentsController under /api/v1/environments, provides EnvironmentsService
 * (Prisma + JWT + orchestrator HTTP), and exports the service for use by DeployJobsModule.
 */
@Module({
  imports: [JwtModule.register({})],
  controllers: [EnvironmentsController],
  providers: [
    EnvironmentsConfigService,
    EnvironmentsService,
    EnvironmentsCrudService,
    EnvironmentsLifecycleService,
    TerminalTmuxCleanupService,
  ],
  exports: [EnvironmentsService, EnvironmentsCrudService],
})
export class EnvironmentsModule { }
