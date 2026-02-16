import type { WizardSchema } from "../types";
import { apiRequest } from "./client";

export async function fetchWizardSchema(
  token: string | undefined,
  version: string
): Promise<WizardSchema> {
  return apiRequest<WizardSchema>(`/api/v1/wizard/${version}/schema.json`, {
    token,
  });
}

export interface WizardGenerateResponse {
  id: string;
  manifestId: string;
}

export async function generateWizard(
  token: string | undefined,
  version: string,
  projectId: string,
  payload: Record<string, unknown>
): Promise<WizardGenerateResponse> {
  return apiRequest<WizardGenerateResponse>(`/api/v1/wizard/${version}/generate`, {
    method: "POST",
    token,
    body: JSON.stringify({ projectId, ...payload }),
  });
}
