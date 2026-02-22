import type { ConfigService } from '@nestjs/config';

import { getApiAppEnv } from '../../src/config/app-env';

function makeConfig(values: Record<string, string | undefined>): ConfigService {
  return {
    get: (key: string) => values[key],
  } as unknown as ConfigService;
}

describe('getApiAppEnv', () => {
  it('uses explicit APP_ENV=localhost and defaults uploadDir/cookieDomain', () => {
    const cfg = makeConfig({
      APP_ENV: 'localhost',
      NODE_ENV: 'production',
      FRONTEND_URL: 'http://localhost:3000',
      COOKIE_DOMAIN: '',
      UPLOAD_DIR: '',
    });
    const env = getApiAppEnv(cfg);
    expect(env.name).toBe('localhost');
    expect(env.uploadDir).toBe('uploads');
    expect(env.cookieDomain).toBeUndefined();
    expect(env.frontendOrigins).toEqual(['http://localhost:3000']);
  });

  it('uses explicit APP_ENV=development', () => {
    const cfg = makeConfig({
      APP_ENV: 'development',
      NODE_ENV: 'production',
      FRONTEND_URL: 'https://dev.pytholit.dev',
      COOKIE_DOMAIN: '.pytholit.dev',
      UPLOAD_DIR: 'uploads',
    });
    const env = getApiAppEnv(cfg);
    expect(env.name).toBe('development');
    expect(env.frontendOrigins).toEqual(['https://dev.pytholit.dev']);
    expect(env.cookieDomain).toBe('.pytholit.dev');
    expect(env.uploadDir).toBe('uploads');
  });

  it('infers development from FRONTEND_URL when APP_ENV missing', () => {
    const cfg = makeConfig({
      APP_ENV: '',
      NODE_ENV: 'production',
      FRONTEND_URL: 'https://dev.pytholit.dev',
      COOKIE_DOMAIN: '',
      UPLOAD_DIR: '',
    });
    const env = getApiAppEnv(cfg);
    expect(env.name).toBe('development');
  });

  it('infers localhost when NODE_ENV=development and APP_ENV missing', () => {
    const cfg = makeConfig({
      APP_ENV: '',
      NODE_ENV: 'development',
      FRONTEND_URL: 'https://pytholit.dev',
      COOKIE_DOMAIN: '',
      UPLOAD_DIR: '',
    });
    const env = getApiAppEnv(cfg);
    expect(env.name).toBe('localhost');
  });
});
