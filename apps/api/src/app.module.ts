import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ClsModule } from 'nestjs-cls';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { AppController } from './app.controller.js';
import { AuthModule } from './auth/auth.module.js';
import { CommonModule } from './common/common.module.js';
import { validateEnv } from './config/env.js';
import { DatabaseModule } from './database/database.module.js';
import { DeployJobsModule } from './deploy-jobs/deploy-jobs.module.js';
import { ProjectsModule } from './projects/projects.module.js';
import { ProjectSpecModule } from './project-spec/project-spec.module.js';
import { UsersModule } from './users/users.module.js';
import { WizardModule } from './wizard/wizard.module.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [resolve(__dirname, '../.env.local'), resolve(__dirname, '../.env')],
      validate: validateEnv,
    }),
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
      },
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
    AuthModule,
    UsersModule,
    ProjectsModule,
    ProjectSpecModule,
    DeployJobsModule,
    WizardModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
