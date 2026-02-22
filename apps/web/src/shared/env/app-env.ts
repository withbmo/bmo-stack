import { env } from '@/env';

export type AppEnvName = 'localhost' | 'development' | 'production';

export interface WebAppEnv {
  name: AppEnvName;
  isLocalhost: boolean;
  isDevelopment: boolean;
  isProduction: boolean;
  apiBase: string;
  apiV1Base: string;
  uploadsBase: string;
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/$/, '');
}

function inferNameFromHostname(hostname: string): AppEnvName {
  if (hostname === 'localhost' || hostname.startsWith('127.')) return 'localhost';
  if (hostname.startsWith('dev.') || hostname.includes('.dev.')) return 'development';
  return 'production';
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
  const rawName = env.NEXT_PUBLIC_APP_ENV;

  const name: AppEnvName =
    rawName && (rawName === 'localhost' || rawName === 'development' || rawName === 'production')
      ? rawName
      : typeof window !== 'undefined'
        ? inferNameFromHostname(window.location.hostname)
        : 'production';

  const direct = env.NEXT_PUBLIC_API_URL;
  const apiUrlDev = env.NEXT_PUBLIC_API_URL_DEV;
  const apiUrlProd = env.NEXT_PUBLIC_API_URL_PROD;

  let apiBase = '';
  // If explicit API URL is set (and not empty), use it
  if (direct && direct.trim() !== '') {
    apiBase = trimTrailingSlash(direct.trim());
  }
  // In localhost dev, use relative URLs to go through Next.js proxy (avoids CORS/cookie issues)
  else if (name === 'localhost') {
    apiBase = ''; // Empty = same origin, uses Next.js rewrites
  }
  else if (name === 'development' && apiUrlDev && apiUrlDev.trim() !== '')
    apiBase = trimTrailingSlash(apiUrlDev.trim());
  else if (name === 'production' && apiUrlProd && apiUrlProd.trim() !== '')
    apiBase = trimTrailingSlash(apiUrlProd.trim());
  else apiBase = trimTrailingSlash(inferApiBaseFromWindow());

  const apiV1Base = apiBase ? `${apiBase}/api/v1` : '/api/v1';
  const uploadsBase = apiBase;

  return {
    name,
    isLocalhost: name === 'localhost',
    isDevelopment: name === 'development',
    isProduction: name === 'production',
    apiBase,
    apiV1Base,
    uploadsBase,
  };
}
