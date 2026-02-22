import { Module } from '@nestjs/common';

import { AdminBillingController } from './controllers/admin-billing.controller';
import { AdminDeployJobsController } from './controllers/admin-deploy-jobs.controller';
import { AdminEnvironmentsController } from './controllers/admin-environments.controller';
import { AdminMembershipsController } from './controllers/admin-memberships.controller';
import { AdminOverviewController } from './controllers/admin-overview.controller';
import { AdminUsersController } from './controllers/admin-users.controller';
import { AdminAuditService } from './services/admin-audit.service';
import { AdminBillingService } from './services/admin-billing.service';
import { AdminDeployJobsService } from './services/admin-deploy-jobs.service';
import { AdminEnvironmentsService } from './services/admin-environments.service';
import { AdminMembershipsService } from './services/admin-memberships.service';
import { AdminOverviewService } from './services/admin-overview.service';
import { AdminUsersService } from './services/admin-users.service';

@Module({
  controllers: [
    AdminOverviewController,
    AdminUsersController,
    AdminMembershipsController,
    AdminEnvironmentsController,
    AdminDeployJobsController,
    AdminBillingController,
  ],
  providers: [
    AdminOverviewService,
    AdminAuditService,
    AdminUsersService,
    AdminMembershipsService,
    AdminEnvironmentsService,
    AdminDeployJobsService,
    AdminBillingService,
  ],
})
export class AdminModule {}
