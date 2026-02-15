import { env } from '@/env';

const getApiBase = (): string => {
  const trim = (value: string) => value.replace(/\/$/, '');
  const direct = env.NEXT_PUBLIC_API_URL;
  if (direct && direct !== '') return trim(direct);

  const modeSpecific =
    process.env.NODE_ENV === 'development'
      ? env.NEXT_PUBLIC_API_URL_DEV
      : env.NEXT_PUBLIC_API_URL_PROD;
  if (modeSpecific && modeSpecific !== '') return trim(modeSpecific);

  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3001';
  }
  return '';
};

export const API_BASE = getApiBase();
export const API_V1 = '/api/v1';

export interface ApiError {
  detail: string | { msg?: string; loc?: unknown[] }[];
  status: number;
}

export function getApiErrorMessage(
  err: unknown,
  fallback = 'Something went wrong. Please try again.'
): string {
  if (err === null || err === undefined) return fallback;
  const apiErr = err as ApiError;
  if (typeof apiErr.detail === 'string' && apiErr.detail) return apiErr.detail;
  if (Array.isArray(apiErr.detail) && apiErr.detail.length > 0) {
    const first = apiErr.detail[0];
    const msg =
      first &&
      typeof first === 'object' &&
      typeof (first as { msg?: string }).msg === 'string'
        ? (first as { msg: string }).msg
        : null;
    if (msg) return msg;
  }
  return fallback;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, ...init } = options;
  const base = API_BASE || '';
  const url = base ? `${base}${path}` : path;
  const headers = new Headers(init.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (!headers.has('Content-Type') && init.body && typeof init.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }
  const res = await fetch(url, { ...init, headers });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  if (!res.ok) {
    const detail =
      typeof data.detail === 'string'
        ? data.detail
        : (typeof data.message === 'string' ? data.message : null) ??
          data.detail?.[0]?.msg ??
          res.statusText;
    throw { detail, status: res.status } as ApiError;
  }
  return data as T;
}

