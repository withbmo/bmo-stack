import type { ConfigService } from '@nestjs/config';

import { FRONTEND_URL_DEFAULT, UPLOAD_DIR_DEFAULT } from './defaults';

export type AppEnvName = 'localhost' | 'development' | 'production';

export interface ApiAppEnv {
  name: AppEnvName;
  isLocalhost: boolean;
  isDevelopment: boolean;
  isProduction: boolean;
  frontendOrigins: string[];
  cookieDomain?: string;
  uploadDir: string;
}

const APP_ENV_NAMES: AppEnvName[] = ['localhost', 'development', 'production'];

function normalizeEnvName(raw: string): AppEnvName | null {
  const v = raw.trim().toLowerCase();
  return (APP_ENV_NAMES as string[]).includes(v) ? (v as AppEnvName) : null;
}

function inferNameFromFrontendUrl(frontendUrl: string): AppEnvName {
  const urls = frontendUrl
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  for (const u of urls) {
    try {
      const parsed = new URL(u);
      const host = parsed.hostname;
      if (host.startsWith('dev.') || host.includes('.dev.')) return 'development';
    } catch {
      // ignore invalid URLs
    }
  }
  return 'production';
}

export function getApiAppEnv(config: ConfigService): ApiAppEnv {
  const rawAppEnv = (config.get<string>('APP_ENV') ?? '').toString();
  const explicit = normalizeEnvName(rawAppEnv);

  const nodeEnv = (config.get<string>('NODE_ENV') ?? process.env.NODE_ENV ?? '').toString();
  const frontendUrl = (config.get<string>('FRONTEND_URL') ?? FRONTEND_URL_DEFAULT).toString();
  const cookieDomainRaw = (config.get<string>('COOKIE_DOMAIN') ?? '').toString();
  const uploadDirRaw = (config.get<string>('UPLOAD_DIR') ?? '').toString();

  const name: AppEnvName =
    explicit ??
    (nodeEnv === 'development' ? 'localhost' : inferNameFromFrontendUrl(frontendUrl));

  const frontendOrigins = frontendUrl
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  const cookieDomain = cookieDomainRaw.trim() !== '' ? cookieDomainRaw.trim() : undefined;
  const uploadDir = uploadDirRaw.trim() !== '' ? uploadDirRaw.trim() : UPLOAD_DIR_DEFAULT;

  return {
    name,
    isLocalhost: name === 'localhost',
    isDevelopment: name === 'development',
    isProduction: name === 'production',
    frontendOrigins,
    cookieDomain,
    uploadDir,
  };
}
