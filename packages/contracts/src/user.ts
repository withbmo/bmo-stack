/**
 * User-related types and contracts
 */

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
  oauthOnboardingRequired: boolean;
  oauthOnboardingCompletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  plan: null;
}
