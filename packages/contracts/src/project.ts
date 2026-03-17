/**
 * Project-related types and contracts
 */

export interface Project {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  repoExportEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}
