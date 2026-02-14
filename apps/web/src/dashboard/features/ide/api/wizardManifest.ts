import type { WizardManifest } from '@/common/types';
import { apiRequest } from '@/common/lib/client';

export async function fetchWizardManifest(
  token: string,
  manifestId: string
): Promise<WizardManifest> {
  return apiRequest<WizardManifest>(`/api/v1/wizard/manifests/${manifestId}`, {
    token,
  });
}
