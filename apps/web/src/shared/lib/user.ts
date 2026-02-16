import type { UserProfile } from "@pytholit/contracts";

import { API_V1,apiRequest } from "./client";

export type { UserProfile };

export interface UserProfileUpdate {
  email?: string;
  fullName?: string;
  bio?: string | null;
}

const USERS_PREFIX = `${API_V1}/users`;

export async function getCurrentUser(token?: string): Promise<UserProfile> {
  return apiRequest<UserProfile>(`${USERS_PREFIX}/me`, { method: "GET", token });
}

export async function updateCurrentUser(
  token: string | undefined,
  payload: UserProfileUpdate
): Promise<UserProfile> {
  return apiRequest<UserProfile>(`${USERS_PREFIX}/me`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export async function uploadAvatar(
  token: string | undefined,
  file: File
): Promise<UserProfile> {
  const form = new FormData();
  form.append("file", file);
  return apiRequest<UserProfile>(`${USERS_PREFIX}/me/avatar`, {
    method: "POST",
    token,
    body: form,
  });
}

export async function deleteAvatar(token?: string): Promise<UserProfile> {
  return apiRequest<UserProfile>(`${USERS_PREFIX}/me/avatar`, {
    method: "DELETE",
    token,
  });
}
