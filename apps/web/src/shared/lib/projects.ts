import type { Project as ContractProject } from '@pytholit/contracts';

import type { Project as ViewProject } from '../types';
import { API_V1, apiRequest, snakeToCamel } from './client';

// API responses are mapped into UI-friendly types in src/types.
// Prefer @pytholit/contracts when API shapes match.

type ApiProject = ContractProject;
export type ProjectListState = 'active' | 'archived' | 'all';

const mapProject = (project: ApiProject): ViewProject => ({
  id: project.id,
  name: project.name,
  framework: 'FastAPI',
  region: 'us-east-1',
  status: project.lifecycleState === 'archived' ? 'stopped' : 'running',
  lifecycleState: project.lifecycleState,
  archivedAt: project.archivedAt,
  lastDeployed: project.updatedAt,
  cpuUsage: 0,
  memoryUsage: 0,
});

const PROJECTS_PREFIX = `${API_V1}/projects`;

export async function listProjects(
  token?: string,
  state: ProjectListState = 'active',
): Promise<ViewProject[]> {
  const projects = snakeToCamel(
    await apiRequest<ApiProject[]>(PROJECTS_PREFIX, {
      method: 'GET',
      token,
      query: { state },
    })
  );
  return projects.map(mapProject);
}

export async function getProject(
  token: string | undefined,
  projectId: string
): Promise<ViewProject> {
  const project = snakeToCamel(
    await apiRequest<ApiProject>(`${PROJECTS_PREFIX}/${projectId}`, {
      method: 'GET',
      token,
    })
  );
  return mapProject(project);
}

export async function createProject(
  token: string | undefined,
  payload: { name: string; slug?: string; repo_export_enabled?: boolean }
): Promise<ViewProject> {
  const project = snakeToCamel(
    await apiRequest<ApiProject>(PROJECTS_PREFIX, {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    })
  );
  return mapProject(project);
}

export async function updateProject(
  token: string | undefined,
  projectId: string,
  payload: { name?: string; slug?: string; repo_export_enabled?: boolean }
): Promise<ViewProject> {
  const project = snakeToCamel(
    await apiRequest<ApiProject>(`${PROJECTS_PREFIX}/${projectId}`, {
      method: 'PATCH',
      token,
      body: JSON.stringify(payload),
    })
  );
  return mapProject(project);
}

export async function archiveProject(
  token: string | undefined,
  projectId: string,
): Promise<ViewProject> {
  const project = snakeToCamel(
    await apiRequest<ApiProject>(`${PROJECTS_PREFIX}/${projectId}/archive`, {
      method: 'PATCH',
      token,
    }),
  );

  return mapProject(project);
}

export async function restoreProject(
  token: string | undefined,
  projectId: string,
): Promise<ViewProject> {
  const project = snakeToCamel(
    await apiRequest<ApiProject>(`${PROJECTS_PREFIX}/${projectId}/restore`, {
      method: 'PATCH',
      token,
    }),
  );

  return mapProject(project);
}
