import { apiRequest, API_V1, snakeToCamel } from './client';
import type { Environment } from '../types';
import type { Environment as ContractEnvironment } from '@pytholit/contracts';

// API responses are mapped into UI-friendly types in src/types.
// Prefer @pytholit/contracts when API shapes match.
const mapEnvironment = (env: ContractEnvironment): Environment => ({
  id: env.id,
  name: env.name as Environment['name'],
  displayName: env.displayName,
  executionMode: env.executionMode as Environment['executionMode'],
  region: env.region ?? null,
  visibility: env.visibility as Environment['visibility'],
  config: (env.config as Record<string, unknown>) ?? undefined,
  createdAt: env.createdAt,
  updatedAt: env.updatedAt,
});

export async function listEnvironments(token: string): Promise<Environment[]> {
  const environments = snakeToCamel(
    await apiRequest<ContractEnvironment[]>(`${API_V1}/environments`, {
      method: 'GET',
      token,
    })
  );
  return environments.map(mapEnvironment);
}

export async function getEnvironment(token: string, envId: string): Promise<Environment> {
  const env = snakeToCamel(
    await apiRequest<ContractEnvironment>(`${API_V1}/environments/${envId}`, {
      method: 'GET',
      token,
    })
  );
  return mapEnvironment(env);
}

export async function createEnvironment(
  token: string,
  payload: {
    name: Environment['name'];
    displayName: string;
    executionMode: Environment['executionMode'];
    visibility: Environment['visibility'];
    region?: string | null;
    config?: Record<string, unknown> | null;
    environmentClass: 'dev' | 'prod';
  }
): Promise<Environment> {
  const env = snakeToCamel(
    await apiRequest<ContractEnvironment>(`${API_V1}/environments`, {
      method: 'POST',
      token,
      body: JSON.stringify(payload),
    })
  );
  return mapEnvironment(env);
}

export async function updateEnvironment(
  token: string,
  envId: string,
  payload: {
    displayName?: string;
    executionMode?: Environment['executionMode'];
    visibility?: Environment['visibility'];
    region?: string | null;
    config?: Record<string, unknown> | null;
  }
): Promise<Environment> {
  const env = snakeToCamel(
    await apiRequest<ContractEnvironment>(`${API_V1}/environments/${envId}`, {
      method: 'PATCH',
      token,
      body: JSON.stringify(payload),
    })
  );
  return mapEnvironment(env);
}

export async function startEnvironment(token: string, envId: string): Promise<{ message: string }> {
  return apiRequest(`${API_V1}/environments/${envId}/start`, {
    method: 'POST',
    token,
  });
}

export async function stopEnvironment(token: string, envId: string): Promise<{ message: string }> {
  return apiRequest(`${API_V1}/environments/${envId}/stop`, {
    method: 'POST',
    token,
  });
}

export async function terminateEnvironment(
  token: string,
  envId: string
): Promise<{ message: string }> {
  return apiRequest(`${API_V1}/environments/${envId}/terminate`, {
    method: 'POST',
    token,
  });
}

export async function getEnvironmentStatus(
  token: string,
  envId: string
): Promise<{
  environmentId: string;
  status: string;
  state?: string;
  instanceId?: string;
  privateIp?: string;
  ipv6Addresses?: string[];
  region?: string;
  lastUpdated: string;
}> {
  return apiRequest(`${API_V1}/environments/${envId}/status`, {
    method: 'GET',
    token,
  });
}

export async function createTerminalSession(
  token: string,
  envId: string
): Promise<{ token: string; expiresAt: string; wsUrl: string }> {
  return apiRequest(`${API_V1}/environments/${envId}/terminal/session`, {
    method: 'POST',
    token,
  });
}

export async function createProxySession(
  token: string,
  envId: string,
  serviceKey?: string
): Promise<{ token: string; expiresAt: string }> {
  return apiRequest(`${API_V1}/environments/${envId}/proxy/session`, {
    method: 'POST',
    token,
    body: JSON.stringify({ serviceKey }),
  });
}

export async function listEnvironmentServices(
  token: string,
  envId: string
): Promise<{ key: string; path: string; description?: string }[]> {
  return apiRequest(`${API_V1}/environments/${envId}/services`, {
    method: 'GET',
    token,
  });
}

export async function setEnvironmentAccessMode(
  token: string,
  envId: string,
  mode: 'site_only' | 'api_key_enabled'
): Promise<Environment> {
  const env = snakeToCamel(
    await apiRequest<ContractEnvironment>(`${API_V1}/environments/${envId}/access-mode`, {
      method: 'PATCH',
      token,
      body: JSON.stringify({ mode }),
    })
  );

  return mapEnvironment(env);
}

export async function rotateProdApiKey(
  token: string,
  envId: string
): Promise<{ apiKey: string; rotatedAt: string }> {
  return apiRequest(`${API_V1}/environments/${envId}/prod-api-key/rotate`, {
    method: 'POST',
    token,
  });
}
