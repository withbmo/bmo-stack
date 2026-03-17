import type { OAuthOnboardingStatusResponse, User } from '@pytholit/contracts';

import { API_V1, apiRequest } from './client';

export type { User };

export interface UserProfileUpdate {
  username?: string;
  firstName?: string;
  lastName?: string;
  bio?: string | null;
}

export interface CompleteOAuthOnboardingInput {
  username: string;
  firstName: string;
  lastName: string;
  bio?: string | null;
}

const USERS_PREFIX = `${API_V1}/users`;

const ME_CACHE_TTL_MS = 4000;
let meCache: { key: string; expiresAt: number; value: User } | null = null;
const meInFlight = new Map<string, Promise<User>>();

export async function getCurrentUser(token?: string): Promise<User> {
  const key = token ?? '__session__';
  const now = Date.now();

  if (meCache && meCache.key === key && meCache.expiresAt > now) {
    return meCache.value;
  }

  const existing = meInFlight.get(key);
  if (existing) return existing;

  const request = (async () => {
    try {
      const profile = await apiRequest<User>(`${USERS_PREFIX}/me`, { method: 'GET', token });
      meCache = { key, value: profile, expiresAt: Date.now() + ME_CACHE_TTL_MS };
      return profile;
    } catch (err) {
      // On rate limit, serve stale cache rather than hard-failing
      if ((err as { status?: number })?.status === 429 && meCache && meCache.key === key) {
        return meCache.value;
      }
      throw err;
    }
  })();

  meInFlight.set(key, request);
  try {
    return await request;
  } finally {
    meInFlight.delete(key);
  }
}

export function invalidateUserCache(): void {
  meCache = null;
}

export async function updateCurrentUser(
  token: string | undefined,
  payload: UserProfileUpdate
): Promise<User> {
  invalidateUserCache();
  return apiRequest<User>(`${USERS_PREFIX}/me`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(payload),
  });
}

export async function uploadAvatar(
  token: string | undefined,
  file: File
): Promise<User> {
  invalidateUserCache();
  const form = new FormData();
  form.append('file', file);
  return apiRequest<User>(`${USERS_PREFIX}/me/avatar`, {
    method: 'POST',
    token,
    body: form,
  });
}

export async function deleteAvatar(token?: string): Promise<User> {
  invalidateUserCache();
  return apiRequest<User>(`${USERS_PREFIX}/me/avatar`, {
    method: 'DELETE',
    token,
  });
}

export async function getOAuthOnboardingStatus(
  token?: string
): Promise<OAuthOnboardingStatusResponse> {
  return apiRequest<OAuthOnboardingStatusResponse>(`${USERS_PREFIX}/me/oauth-onboarding`, {
    method: 'GET',
    token,
  });
}

export async function completeOAuthOnboarding(
  token: string | undefined,
  payload: CompleteOAuthOnboardingInput
): Promise<User> {
  invalidateUserCache();
  return apiRequest<User>(`${USERS_PREFIX}/me/oauth-onboarding`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(payload),
  });
}
