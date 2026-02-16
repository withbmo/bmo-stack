import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import type { NextFunction,Request, Response } from 'express';
import * as express from 'express';
import helmet from 'helmet';
import * as path from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  // Disable Nest's default body parser so we can:
  // - keep JSON parsing for all routes
  // - preserve the raw body for Stripe webhook signature verification
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

  // Global validation pipe - uses class-validator DTOs from @pytholit/validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // CORS - explicit origins in production
  const isDev = process.env.NODE_ENV === 'development';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  app.enableCors({
    origin: isDev ? true : frontendUrl.split(',').map((o) => o.trim()),
    credentials: true,
  });

  // Static uploads (avatars)
  const uploadDirRaw = process.env.UPLOAD_DIR || '';
  const uploadDir = uploadDirRaw.trim() !== '' ? uploadDirRaw.trim() : 'uploads';
  app.use(`/${uploadDir}`, express.static(path.join(process.cwd(), uploadDir)));

  // API prefix
  const globalPrefix = 'api/v1';
  app.setGlobalPrefix(globalPrefix);

  // Stripe webhook must receive the raw request body for signature verification.
  // We parse it as raw only for this endpoint.
  const stripeWebhookPath = `/${globalPrefix}/billing/webhook`;
  const jsonParser = express.json();
  const urlencodedParser = express.urlencoded({ extended: true });

  app.use(stripeWebhookPath, express.raw({ type: 'application/json' }));
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.originalUrl?.startsWith(stripeWebhookPath)) return next();
    return jsonParser(req, res, next);
  });
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.originalUrl?.startsWith(stripeWebhookPath)) return next();
    return urlencodedParser(req, res, next);
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 Pytholit API running on: http://localhost:${port}`);
  console.log(`📚 API docs: http://localhost:${port}/api/v1`);
}

bootstrap();
