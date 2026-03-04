import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { BillingModule } from '../billing/billing.module';
import { EnvironmentsConfigService } from './environments.config';
import { EnvironmentsController } from './environments.controller';
import { EnvironmentsService } from './environments.service';
import { EnvironmentsCrudService } from './services/environments-crud.service';
import { EnvironmentsLifecycleService } from './services/environments-lifecycle.service';
import { EnvironmentsStatusReconcileService } from './services/environments-status-reconcile.service';

/**
 * Exposes the environments REST API and business logic.
 * Registers EnvironmentsController under /api/v1/environments, provides EnvironmentsService
 * (Prisma + JWT + orchestrator HTTP), and exports the service for use by DeployJobsModule.
 */
@Module({
  imports: [JwtModule.register({}), forwardRef(() => BillingModule)],
  controllers: [EnvironmentsController],
  providers: [
    EnvironmentsConfigService,
    EnvironmentsService,
    EnvironmentsCrudService,
    EnvironmentsLifecycleService,
    EnvironmentsStatusReconcileService,
  ],
  exports: [EnvironmentsService, EnvironmentsCrudService, EnvironmentsLifecycleService],
})
export class EnvironmentsModule { }
