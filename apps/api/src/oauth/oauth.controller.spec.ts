import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { OauthController } from './oauth.controller';
import { OauthCodeService } from './oauth-code.service';
import { OauthStateService } from './oauth-state.service';
import { OauthService } from './oauth.service';
import { ConfigService } from '@nestjs/config';

describe('OauthController (exchange)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [OauthController],
      providers: [
        OauthCodeService,
        OauthStateService,
        {
          provide: OauthService,
          useValue: {
            handleOAuthLogin: jest.fn(),
            unlinkOAuthAccount: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('http://localhost:3000'),
          },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
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

  it('rejects invalid code format', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/oauth/exchange')
      .send({ code: 'not-hex' })
      .expect(400);
  });

  it('rejects missing code', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/oauth/exchange')
      .send({})
      .expect(400);
  });
});
