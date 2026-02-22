import type { AdminLevel } from '@pytholit/contracts';
import { apiRequest, API_V1 } from './client';

export interface AdminMe {
  id: string;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  isEmailVerified: boolean;
  isActive: boolean;
  isAdmin: boolean;
  adminLevel: AdminLevel | null;
}

const USERS_PREFIX = `${API_V1}/users`;

export async function getCurrentUser(token: string): Promise<AdminMe> {
  return apiRequest<AdminMe>(`${USERS_PREFIX}/me`, { method: 'GET', token });
}
