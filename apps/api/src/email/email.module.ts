import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

import { resolveEmailRuntimeConfig } from './email.config';
import { EmailConfigService } from './email.config';
import { EmailProcessor } from './email.processor';
import { EmailQueueService } from './email-queue.service';
import { EmailTemplateRendererService } from './email-template-renderer.service';
import { EmailService } from './email.service';
import { SmtpEmailTransport } from './email.transport';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const runtime = resolveEmailRuntimeConfig(configService);

        return {
          transport: runtime.smtpEnabled
            ? {
                host: runtime.smtpHost,
                port: runtime.smtpPort,
                secure: runtime.smtpSecure,
                requireTLS: !runtime.smtpSecure,
                auth: {
                  user: runtime.smtpUser,
                  pass: runtime.smtpPass,
                },
              }
            : {
                jsonTransport: true,
              },
          defaults: {
            from: {
              address: runtime.fromAddress,
              name: runtime.fromName,
            },
          },
        };
      },
    }),
  ],
  providers: [
    EmailConfigService,
    EmailTemplateRendererService,
    SmtpEmailTransport,
    EmailProcessor,
    EmailQueueService,
    EmailService,
  ],
  exports: [EmailService],
})
export class EmailModule {}
