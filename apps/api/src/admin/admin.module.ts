import { Module } from '@nestjs/common';

import { AdminBillingController } from './controllers/admin-billing.controller';
import { AdminDeployJobsController } from './controllers/admin-deploy-jobs.controller';
import { AdminEnvironmentsController } from './controllers/admin-environments.controller';
import { AdminOverviewController } from './controllers/admin-overview.controller';
import { AdminUsersController } from './controllers/admin-users.controller';
import { AdminBillingService } from './services/admin-billing.service';
import { AdminAuditService } from './services/admin-audit.service';
import { AdminDeployJobsService } from './services/admin-deploy-jobs.service';
import { AdminEnvironmentsService } from './services/admin-environments.service';
import { AdminOverviewService } from './services/admin-overview.service';
import { AdminUsersService } from './services/admin-users.service';

@Module({
  controllers: [
    AdminOverviewController,
    AdminUsersController,
    AdminEnvironmentsController,
    AdminDeployJobsController,
    AdminBillingController,
  ],
  providers: [
    AdminOverviewService,
    AdminAuditService,
    AdminUsersService,
    AdminEnvironmentsService,
    AdminDeployJobsService,
    AdminBillingService,
  ],
})
export class AdminModule {}

