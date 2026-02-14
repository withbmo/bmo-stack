import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { EnvironmentsModule } from './environments/environments.module';
import { DeployJobsModule } from './deploy-jobs/deploy-jobs.module';
import { OtpModule } from './otp/otp.module';
import { OauthModule } from './oauth/oauth.module';
import { BillingModule } from './billing/billing.module';
import { EmailModule } from './email/email.module';
import { CommonModule } from './common/common.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { WizardModule } from './wizard/wizard.module';
import { validateEnv } from './config/env';
import { EntitlementsModule } from './entitlements/entitlements.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: validateEnv,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    CommonModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    OtpModule,
    OauthModule,
    BillingModule,
    EntitlementsModule,
    EmailModule,
    ProjectsModule,
    EnvironmentsModule,
    DeployJobsModule,
    WizardModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
