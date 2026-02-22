/**
 * User-related types and contracts
 */

export const ADMIN_LEVELS = ['owner', 'operator', 'viewer'] as const;

export type AdminLevel = (typeof ADMIN_LEVELS)[number];

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  isEmailVerified: boolean;
  isActive: boolean;
  isAdmin: boolean;
  adminLevel: AdminLevel | null;
  stripeCustomerId: string | null;
  novuSubscriberId: string | null;
  createdAt: string;
  updatedAt: string;
  plan: UserPlan | null;
}

/**
 * User profile subset - use User type instead unless you need this specific shape
 * @deprecated Use User instead
 */
export type UserProfile = User;

export interface UserPlan {
  id: string;
  name: string;
  displayName: string;
  description: string | null;
  features: PlanFeature[];
}

export interface PlanFeature {
  id: string;
  name: string;
  value: string | number | boolean;
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  bio?: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface UserPreferences {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  theme: 'light' | 'dark' | 'system';
}
