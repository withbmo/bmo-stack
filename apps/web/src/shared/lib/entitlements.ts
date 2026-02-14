import { apiRequest, API_V1 } from './client';
import type { EntitlementLimitsResponse, RecordEntitlementUsageInput } from '@pytholit/contracts';

export async function getEntitlementLimits(
  token: string
): Promise<EntitlementLimitsResponse> {
  return apiRequest<EntitlementLimitsResponse>(`${API_V1}/entitlements/limits`, {
    method: 'GET',
    token,
  });
}

export async function recordEntitlementUsage(
  token: string,
  input: RecordEntitlementUsageInput
) {
  return apiRequest(`${API_V1}/entitlements/usage`, {
    method: 'POST',
    token,
    body: JSON.stringify(input),
  });
}
