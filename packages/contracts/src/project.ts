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

export interface CreateProjectInput {
  name: string;
  slug?: string;
  repoExportEnabled?: boolean;
}

export interface UpdateProjectInput {
  name?: string;
  slug?: string;
  repoExportEnabled?: boolean;
}

export interface ProjectWithStats extends Project {
  environmentsCount: number;
  deploymentsCount: number;
  lastDeployedAt: string | null;
}
