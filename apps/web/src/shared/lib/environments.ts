import type {
  AccessMode,
  Ec2Architecture,
  Environment as ContractEnvironment,
  EnvironmentClass,
  ServerPreset,
} from '@pytholit/contracts';

import type { Environment } from '../types';
import { API_V1, apiRequest, snakeToCamel } from './client';

// API responses are mapped into UI-friendly types in src/types.
// Prefer @pytholit/contracts when API shapes match.
const mapEnvironment = (env: ContractEnvironment): Environment => ({
  id: env.id,
  envType: env.envType as Environment['envType'],
  displayName: env.displayName,
  executionMode: env.executionMode as Environment['executionMode'],
  region: env.region ?? null,
  visibility: env.visibility as Environment['visibility'],
  config: (env.config as Record<string, unknown>) ?? undefined,
  createdAt: env.createdAt,
  updatedAt: env.updatedAt,
});

export async function listEnvironments(token?: string): Promise<Environment[]> {
  const environments = snakeToCamel(
    await apiRequest<ContractEnvironment[]>(`${API_V1}/environments`, {
      method: 'GET',
      token,
    })
  );
  return environments.map(mapEnvironment);
}

export async function fetchEnvironmentRegions(
  token?: string
): Promise<{ region: string }[]> {
  return apiRequest<{ region: string }[]>(`${API_V1}/environments/regions`, {
    method: 'GET',
    token,
  });
}

export async function fetchInstanceTypes(
  token: string | undefined,
  params: {
    region: string;
    arch: Ec2Architecture;
    q?: string;
    limit?: number;
  }
): Promise<{ instanceType: string; vcpu: number; memoryMiB: number }[]> {
  const qs = new URLSearchParams();
  qs.set('region', params.region);
  qs.set('arch', params.arch);
  if (params.q) qs.set('q', params.q);
  if (params.limit) qs.set('limit', String(params.limit));

  return apiRequest<{ instanceType: string; vcpu: number; memoryMiB: number }[]>(
    `${API_V1}/environments/instance-types?${qs.toString()}`,
    {
      method: 'GET',
      token,
    }
  );
}

export async function fetchInstanceType(
  token: string | undefined,
  params: {
    region: string;
    arch: Ec2Architecture;
    instanceType: string;
  }
): Promise<{ instanceType: string; vcpu: number; memoryMiB: number }> {
  const qs = new URLSearchParams();
  qs.set('region', params.region);
  qs.set('arch', params.arch);
  qs.set('instanceType', params.instanceType);

  return apiRequest<{ instanceType: string; vcpu: number; memoryMiB: number }>(
    `${API_V1}/environments/instance-type?${qs.toString()}`,
    {
      method: 'GET',
      token,
    }
  );
}

export async function getEnvironment(token: string | undefined, envId: string): Promise<Environment> {
  const env = snakeToCamel(
    await apiRequest<ContractEnvironment>(`${API_V1}/environments/${envId}`, {
      method: 'GET',
      token,
    })
  );
  return mapEnvironment(env);
}

export async function createEnvironment(
  token: string | undefined,
  payload: {
    envType: Environment['envType'];
    displayName: string;
    executionMode: Environment['executionMode'];
    visibility: Environment['visibility'];
    region?: string | null;
    config?: Record<string, unknown> | null;
    environmentClass: EnvironmentClass;
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
  token: string | undefined,
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

export async function deleteEnvironment(
  token: string | undefined,
  envId: string
): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`${API_V1}/environments/${envId}`, {
    method: 'DELETE',
    token,
  });
}

export async function startEnvironment(token: string | undefined, envId: string): Promise<{ message: string }> {
  return apiRequest(`${API_V1}/environments/${envId}/start`, {
    method: 'POST',
    token,
  });
}

export async function stopEnvironment(token: string | undefined, envId: string): Promise<{ message: string }> {
  return apiRequest(`${API_V1}/environments/${envId}/stop`, {
    method: 'POST',
    token,
  });
}

export async function terminateEnvironment(
  token: string | undefined,
  envId: string
): Promise<{ message: string }> {
  return apiRequest(`${API_V1}/environments/${envId}/terminate`, {
    method: 'POST',
    token,
  });
}

export async function getEnvironmentStatus(
  token: string | undefined,
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
  token: string | undefined,
  envId: string,
  tabId: string
): Promise<{ token: string; expiresAt: string; wsUrl: string }> {
  return apiRequest(`${API_V1}/environments/${envId}/terminal/session`, {
    method: 'POST',
    token,
    body: JSON.stringify({ tabId }),
  });
}

export type TerminalTabSummary = {
  id: string;
  title: string;
  isActive: boolean;
  tmuxEnabled: boolean;
  updatedAt: string;
  lastActiveAt?: string | null;
  archivedAt?: string | null;
};

export type TerminalTabDetail = TerminalTabSummary & {
  transcript: string;
  lastSeq: number;
  tmuxSessionName?: string | null;
  tmuxExpiresAt?: string | null;
};

export async function listTerminalTabs(
  token: string | undefined,
  envId: string
): Promise<TerminalTabSummary[]> {
  return apiRequest(`${API_V1}/environments/${envId}/terminal/tabs`, { method: 'GET', token });
}

export async function createTerminalTab(
  token: string | undefined,
  envId: string
): Promise<TerminalTabSummary> {
  return apiRequest(`${API_V1}/environments/${envId}/terminal/tabs`, { method: 'POST', token });
}

export async function getTerminalTab(
  token: string | undefined,
  envId: string,
  tabId: string
): Promise<TerminalTabDetail> {
  return apiRequest(`${API_V1}/environments/${envId}/terminal/tabs/${tabId}`, { method: 'GET', token });
}

export async function updateTerminalTab(
  token: string | undefined,
  envId: string,
  tabId: string,
  payload: { title?: string; tmuxEnabled?: boolean; isActive?: boolean }
): Promise<TerminalTabSummary> {
  return apiRequest(`${API_V1}/environments/${envId}/terminal/tabs/${tabId}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(payload),
  });
}

export async function deleteTerminalTab(
  token: string | undefined,
  envId: string,
  tabId: string
): Promise<{ ok: true }> {
  return apiRequest(`${API_V1}/environments/${envId}/terminal/tabs/${tabId}`, {
    method: 'DELETE',
    token,
  });
}

export async function appendTerminalTranscript(
  token: string | undefined,
  envId: string,
  tabId: string,
  payload: { delta: string; seq: number }
): Promise<{ ok: true; applied: boolean }> {
  return apiRequest(`${API_V1}/environments/${envId}/terminal/tabs/${tabId}/append`, {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
}

export async function createProxySession(
  token: string | undefined,
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
  token: string | undefined,
  envId: string
): Promise<{ key: string; path: string; description?: string }[]> {
  return apiRequest(`${API_V1}/environments/${envId}/services`, {
    method: 'GET',
    token,
  });
}

export async function setEnvironmentAccessMode(
  token: string | undefined,
  envId: string,
  mode: AccessMode
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
  token: string | undefined,
  envId: string
): Promise<{ apiKey: string; rotatedAt: string }> {
  return apiRequest(`${API_V1}/environments/${envId}/prod-api-key/rotate`, {
    method: 'POST',
    token,
  });
}

export async function fetchServerPresets(token?: string): Promise<ServerPreset[]> {
  return apiRequest<ServerPreset[]>(`${API_V1}/environments/presets`, {
    method: 'GET',
    token,
  });
}
