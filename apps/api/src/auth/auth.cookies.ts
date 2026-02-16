import type { CookieOptions, Response } from 'express';

export const AUTH_COOKIE_NAME = 'pytholit_auth';
export const OAUTH_STATE_COOKIE_NAME = 'oauth_state';
export const OAUTH_NEXT_COOKIE_NAME = 'oauth_next';

const ONE_HOUR_MS = 60 * 60 * 1000;
const FIVE_MINUTES_MS = 5 * 60 * 1000;

function isProd() {
  return process.env.NODE_ENV === 'production';
}

function cookieDomain(): string | undefined {
  const raw = process.env.COOKIE_DOMAIN || '';
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  return trimmed;
}

function baseCookieOptions(maxAgeMs: number): CookieOptions {
  const domain = cookieDomain();
  return {
    httpOnly: true,
    secure: isProd(),
    sameSite: 'lax',
    path: '/',
    maxAge: maxAgeMs,
    ...(domain ? { domain } : {}),
  };
}

export function setAuthCookie(res: Response, jwt: string) {
  res.cookie(AUTH_COOKIE_NAME, jwt, baseCookieOptions(ONE_HOUR_MS));
}

export function clearAuthCookie(res: Response) {
  const opts = baseCookieOptions(ONE_HOUR_MS);
  res.clearCookie(AUTH_COOKIE_NAME, opts);
}

export function setOauthStateCookie(res: Response, state: string) {
  res.cookie(OAUTH_STATE_COOKIE_NAME, state, baseCookieOptions(FIVE_MINUTES_MS));
}

export function clearOauthStateCookie(res: Response) {
  const opts = baseCookieOptions(FIVE_MINUTES_MS);
  res.clearCookie(OAUTH_STATE_COOKIE_NAME, opts);
}

export function setOauthNextCookie(res: Response, nextPath: string) {
  res.cookie(OAUTH_NEXT_COOKIE_NAME, nextPath, baseCookieOptions(FIVE_MINUTES_MS));
}

export function clearOauthNextCookie(res: Response) {
  const opts = baseCookieOptions(FIVE_MINUTES_MS);
  res.clearCookie(OAUTH_NEXT_COOKIE_NAME, opts);
}
