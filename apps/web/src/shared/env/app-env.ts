import { env } from '@/env';

export type AppEnvName = 'development' | 'production';

export interface WebAppEnv {
  name: AppEnvName;
  isDevelopment: boolean;
  isProduction: boolean;
  apiBase: string;
  apiV1Base: string;
  uploadsBase: string;
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/$/, '');
}

function inferApiBaseFromWindow(): string {
  if (typeof window === 'undefined') return '';
  const { protocol, hostname } = window.location;
  if (!hostname) return '';
  if (hostname === 'localhost' || hostname.startsWith('127.')) return `${protocol}//${hostname}`;
  const hostWithoutApi = hostname.replace(/^api\./, '');
  return `${protocol}//api.${hostWithoutApi}`;
}

export function getWebAppEnv(): WebAppEnv {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const name: AppEnvName = isDevelopment ? 'development' : 'production';

  const direct = env.NEXT_PUBLIC_API_URL;
  const apiUrlDev = env.NEXT_PUBLIC_API_URL_DEV;
  const apiUrlProd = env.NEXT_PUBLIC_API_URL_PROD;

  let apiBase = '';
  if (direct && direct.trim() !== '') {
    apiBase = trimTrailingSlash(direct.trim());
  } else if (name === 'development' && apiUrlDev && apiUrlDev.trim() !== '') {
    apiBase = trimTrailingSlash(apiUrlDev.trim());
  } else if (name === 'production' && apiUrlProd && apiUrlProd.trim() !== '') {
    apiBase = trimTrailingSlash(apiUrlProd.trim());
  } else {
    apiBase = trimTrailingSlash(inferApiBaseFromWindow());
  }
  // In development with no explicit URL, same-origin (Next.js rewrites)
  if (name === 'development' && !direct?.trim() && !apiUrlDev?.trim()) {
    apiBase = '';
  }

  const apiV1Base = apiBase ? `${apiBase}/api/v1` : '/api/v1';
  const uploadsBase = apiBase;

  return {
    name,
    isDevelopment,
    isProduction: name === 'production',
    apiBase,
    apiV1Base,
    uploadsBase,
  };
}
