import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from './common/filters/http-exception.filter.js';
import { FRONTEND_URL_DEFAULT } from './config/defaults.js';

async function bootstrap() {
  // Better Auth expects Nest's built-in parser to be disabled.
  // The Nest Better Auth adapter re-adds default parsers for non-auth routes.
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
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  // Cookies (OAuth state + auth session)
  app.use(cookieParser());

  // Global exception filters
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global validation pipe - validates Nest DTOs across the API
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // CORS - allow all origins in development, explicit list in production
  const configService = app.get(ConfigService);
  const isDevelopment =
    (configService.get<string>('NODE_ENV') ?? process.env.NODE_ENV) === 'development';
  const frontendUrl =
    (configService.get<string>('FRONTEND_URL') ?? FRONTEND_URL_DEFAULT).toString();
  const frontendOrigins = frontendUrl
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  app.enableCors({
    origin: isDevelopment ? true : frontendOrigins,
    credentials: true,
  });

  // API prefix
  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 Pytholit API running on: http://localhost:${port}`);
  console.log(`📚 API docs: http://localhost:${port}/api/v1`);
}

bootstrap();
