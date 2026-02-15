import { apiRequest, API_V1 } from './client';

export interface AdminMe {
  id: string;
  email: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  isEmailVerified: boolean;
  isActive: boolean;
  isSuperuser: boolean;
  role?: string | null;
  permissions?: string[] | null;
}

const USERS_PREFIX = `${API_V1}/users`;

export async function getCurrentUser(token: string): Promise<AdminMe> {
  return apiRequest<AdminMe>(`${USERS_PREFIX}/me`, { method: 'GET', token });
}

