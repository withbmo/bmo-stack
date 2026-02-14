import { apiRequest, API_V1, snakeToCamel } from './client';
import type { Project as ViewProject } from '../types';
import type { Project as ContractProject } from '@pytholit/contracts';

// API responses are mapped into UI-friendly types in src/types.
// Prefer @pytholit/contracts when API shapes match.

type ApiProject = ContractProject;

const mapProject = (project: ApiProject): ViewProject => ({
  id: project.id,
  name: project.name,
  framework: 'FastAPI',
  region: 'us-east-1',
  status: 'running',
  lastDeployed: project.updatedAt,
  cpuUsage: 0,
  memoryUsage: 0,
});

const PROJECTS_PREFIX = `${API_V1}/projects`;

export async function listProjects(token: string): Promise<ViewProject[]> {
  const projects = snakeToCamel(
    await apiRequest<ApiProject[]>(PROJECTS_PREFIX, {
      method: 'GET',
      token,
    })
  );
  return projects.map(mapProject);
}

export async function getProject(
  token: string,
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
  token: string,
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
  token: string,
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
