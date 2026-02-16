import type { EntitlementLimitsResponse, RecordEntitlementUsageInput } from '@pytholit/contracts';

import { API_V1,apiRequest } from './client';

export async function getEntitlementLimits(
  token: string | undefined
): Promise<EntitlementLimitsResponse> {
  return apiRequest<EntitlementLimitsResponse>(`${API_V1}/entitlements/limits`, {
    method: 'GET',
    token,
  });
}

export async function recordEntitlementUsage(
  token: string | undefined,
  input: RecordEntitlementUsageInput
) {
  return apiRequest(`${API_V1}/entitlements/usage`, {
    method: 'POST',
    token,
    body: JSON.stringify(input),
  });
}
