/**
 * Project-related types and contracts
 */

export type ProjectLifecycleState = 'active' | 'archived';

export interface Project {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  repoExportEnabled: boolean;
  lifecycleState: ProjectLifecycleState;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
