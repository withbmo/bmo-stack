// @ts-nocheck
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-env jest */

import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import request from 'supertest';

import { AppModule } from '../../src/app.module';
import { AllExceptionsFilter } from '../../src/common/filters/http-exception.filter';

describe('Auth e2e', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';

    const moduleRef = await Test.createTestingModule({
      imports: [
        // Override ConfigModule env loading for tests to avoid depending on real .env
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
        }),
        AppModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication({
      bodyParser: false,
    });

    // Minimal main.ts-style setup for errors + validation
    app.use(
      helmet({
        hsts: {
          maxAge: 0,
          includeSubDomains: false,
          preload: false,
        },
        crossOriginResourcePolicy: { policy: 'cross-origin' },
      })
    );
    app.use(cookieParser());
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );
    app.setGlobalPrefix('api/v1');

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/v1/auth-flow/check-password-strength returns expected shape', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth-flow/check-password-strength')
      .send({ password: 'MyPassword123!' })
      .expect(201);

    expect(res.body).toHaveProperty('score');
    expect(res.body).toHaveProperty('label');
    expect(res.body).toHaveProperty('crackTime');
    expect(res.body).toHaveProperty('feedback');
    expect(res.body).toHaveProperty('isStrong');
  });

  it('POST /api/v1/auth-flow/check-password-strength validates body via ValidationPipe', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth-flow/check-password-strength')
      // missing "password" field
      .send({})
      .expect(400);

    expect(res.body).toMatchObject({
      success: false,
      statusCode: 400,
      error: 'Bad Request Exception',
      path: '/api/v1/auth-flow/check-password-strength',
    });
    expect(Array.isArray(res.body.message)).toBe(true);
  });
});
