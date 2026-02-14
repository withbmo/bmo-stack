import { apiRequest } from "./client";
import { API_V1 } from "./client";

export interface HealthResponse {
  status: "ok";
}

/** Liveness check - verify API is up before login or other calls */
export async function healthCheck(): Promise<HealthResponse> {
  return apiRequest<HealthResponse>(`${API_V1}/health`, { method: "GET" });
}
