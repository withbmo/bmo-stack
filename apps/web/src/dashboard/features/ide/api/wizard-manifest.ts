import { apiRequest } from "@/shared/lib/client";
import type { WizardManifest } from "@/shared/types";

export async function fetchWizardManifest(
  token: string | undefined,
  manifestId: string
): Promise<WizardManifest> {
  return apiRequest<WizardManifest>(`/api/v1/wizard/manifests/${manifestId}`, {
    token,
  });
}
