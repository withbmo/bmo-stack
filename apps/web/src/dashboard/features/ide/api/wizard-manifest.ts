import type { WizardManifest } from "@/shared/types";
import { apiRequest } from "@/shared/lib/client";

export async function fetchWizardManifest(
  token: string | undefined,
  manifestId: string
): Promise<WizardManifest> {
  return apiRequest<WizardManifest>(`/api/v1/wizard/manifests/${manifestId}`, {
    token,
  });
}
