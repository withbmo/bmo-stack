/** Shape of the authenticated user attached to the request by Better Auth. */
export interface AuthenticatedUser {
  id: string;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  isEmailVerified: boolean;
  isActive: boolean;
}
