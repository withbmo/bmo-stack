import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import type { AdminLevel } from '@pytholit/contracts';
import { CaslModule } from 'nest-casl';

import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import type { AuthenticatedUser } from './auth/auth.types';
import { AuthModule } from './auth/auth.module';
import { appPermissions, type Roles } from './auth-admin/casl/ability.factory';
import { AdminEnrichmentGuard } from './auth-admin/guards/admin-enrichment.guard';
import { CaslAuthorizationGuard } from './auth-admin/guards/casl-authorization.guard';
import { BillingModule } from './billing/billing.module';
import { CommonModule } from './common/common.module';
import { validateEnv } from './config/env';
import { DatabaseModule } from './database/database.module';
import { DeployJobsModule } from './deploy-jobs/deploy-jobs.module';
import { EmailModule } from './email/email.module';
import { EntitlementsModule } from './entitlements/entitlements.module';
import { EnvironmentsModule } from './environments/environments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';
import { WizardModule } from './wizard/wizard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: validateEnv,
    }),
    CaslModule.forRoot({
      getUserFromRequest: (request: { user?: AuthenticatedUser & { isAdmin?: boolean; adminLevel?: AdminLevel | null; roles?: Roles[] } }) => {
        const user = request?.user;
        if (!user?.id) return undefined;
        const roles = new Set<Roles>(Array.isArray(user.roles) ? user.roles : []);
        if (user.adminLevel) roles.add(user.adminLevel);
        return { ...user, roles: [...roles], isAdmin: user.isAdmin, adminLevel: user.adminLevel };
      },
    }),
    CaslModule.forFeature({
      permissions: appPermissions,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,
        limit: 100,
      },
      {
        name: 'auth',
        ttl: 60000,
        limit: 10, // Stricter limit for auth endpoints: 10 requests per minute
      },
      {
        name: 'strict-auth',
        ttl: 60000,
        limit: 5, // Very strict for sensitive operations: 5 requests per minute
      },
    ]),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const redisUrl = config.get<string>('REDIS_URL') || '';
        return {
          connection: redisUrl.startsWith('redis://')
            ? {
              host: redisUrl.replace('redis://', '').split(':')[0],
              port: parseInt(redisUrl.replace('redis://', '').split(':')[1] || '6379'),
            }
            : {
              host: 'localhost',
              port: 6379,
            },
          defaultJobOptions: {
            removeOnComplete: {
              count: 1000,
              age: 24 * 3600,
            },
            removeOnFail: {
              count: 5000,
            },
          },
        };
      },
    }),
    CommonModule,
    DatabaseModule,
    AdminModule,
    AuthModule,
    UsersModule,
    BillingModule,
    EntitlementsModule,
    EmailModule,
    ProjectsModule,
    EnvironmentsModule,
    NotificationsModule,
    DeployJobsModule,
    WizardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // BetterAuthGuard is registered in AuthModule where AUTH_MODULE_OPTIONS_KEY is available
    // Guard execution order: BetterAuthGuard (auth) -> AdminEnrichmentGuard (enrich) -> CaslAuthorizationGuard (authorize) -> ThrottlerGuard (rate limit)
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: CaslAuthorizationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AdminEnrichmentGuard,
    },
  ],
})
export class AppModule { }
