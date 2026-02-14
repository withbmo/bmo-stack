/**
 * User-related types and contracts
 */

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  isEmailVerified: boolean;
  isActive: boolean;
  isSuperuser: boolean;
  stripeCustomerId: string | null;
  novuSubscriberId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  fullName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  plan: UserPlan | null;
}

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
  fullName?: string;
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
