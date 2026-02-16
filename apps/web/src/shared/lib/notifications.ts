import { API_V1,apiRequest } from "./client";

export type NovuTokenResponse = {
  subscriber_id: string;
  subscriber_hash?: string | null;
};

export async function getNovuToken(
  token: string | undefined
): Promise<NovuTokenResponse> {
  return apiRequest(`${API_V1}/notifications/token`, { token });
}
