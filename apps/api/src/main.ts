import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';

import * as express from 'express';
import helmet from 'helmet';
import * as path from 'path';

import { AppModule } from './app.module';
import { setupBodyParsers } from './config/body-parser.setup';
import { getApiAppEnv } from './config/app-env';
import { PrismaService } from './database/prisma.service';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrapInitialAdmin(app: INestApplication) {
  const configService = app.get(ConfigService);
  const prismaService = app.get(PrismaService);
  const initialAdminEmail = (configService.get<string>('INITIAL_ADMIN_EMAIL') ?? '').trim();

  if (!initialAdminEmail) {
    console.log('ℹ️ INITIAL_ADMIN_EMAIL not set; initial admin bootstrap skipped.');
    return;
  }

  const adminCount = await prismaService.client.admin.count();
  if (adminCount > 0) {
    console.log('ℹ️ Admin bootstrap skipped: admins already exist.');
    return;
  }

  const user = await prismaService.client.user.findUnique({
    where: { email: initialAdminEmail },
    select: { id: true },
  });

  if (!user) {
    console.log(
      `⚠️ Admin bootstrap skipped: no user found for INITIAL_ADMIN_EMAIL (${initialAdminEmail}).`
    );
    return;
  }

  await prismaService.client.admin.create({
    data: {
      userId: user.id,
      level: 'owner',
      grantedByUserId: null,
    },
  });

  console.log(`✅ Bootstrapped initial owner admin for ${initialAdminEmail}.`);
}

async function bootstrap() {
  // Disable Nest's default body parser so we can:
  // - keep JSON parsing for all routes
  // - bypass parsing for better-auth routes (it handles its own body parsing)
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // Security headers
  //
  // Important: This demo can run behind an HTTP-only edge proxy (no ALB/TLS).
  // Sending HSTS over HTTP will cause browsers to auto-upgrade to https:// and break access.
  // Default: HSTS disabled unless explicitly enabled via env.
  const enableHsts = process.env.ENABLE_HSTS === 'true';
  app.use(
    helmet({
      hsts: enableHsts
        ? undefined
        : {
          maxAge: 0,
          includeSubDomains: false,
          preload: false,
        },
      // Avatars are served from the API host and rendered by the web app.
      // Allow cross-origin embedding of these static images.
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // Cookies (OAuth state + auth session)
  app.use(cookieParser());

  // Global exception filters
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global validation pipe - uses class-validator DTOs from @pytholit/validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // CORS - explicit origins in production
  const configService = app.get(ConfigService);
  const appEnv = getApiAppEnv(configService);
  const isNodeDev = (configService.get<string>('NODE_ENV') ?? process.env.NODE_ENV) === 'development';
  app.enableCors({
    origin: isNodeDev || appEnv.isLocalhost ? true : appEnv.frontendOrigins,
    credentials: true,
  });

  // Static uploads (avatars)
  app.use(`/${appEnv.uploadDir}`, express.static(path.join(process.cwd(), appEnv.uploadDir)));

  // API prefix
  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);

  await bootstrapInitialAdmin(app);

  // Setup specialized body parsing for webhooks and auth
  setupBodyParsers(app, globalPrefix);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 Pytholit API running on: http://localhost:${port}`);
  console.log(`📚 API docs: http://localhost:${port}/api/v1`);
}

bootstrap();
