import { env } from "@/env";

/**
 * API base URL. Paths are relative to /api/v1.
 * Next.js-compatible env resolution:
 * - `NEXT_PUBLIC_API_URL` takes priority
 * - fallback to `NEXT_PUBLIC_API_URL_DEV` / `NEXT_PUBLIC_API_URL_PROD`
 * - local development fallback: `http://localhost:3001`
 */
const getApiBase = (): string => {
  const trim = (value: string) => value.replace(/\/$/, "");
  const direct = env.NEXT_PUBLIC_API_URL;
  if (direct && direct !== "") return trim(direct);

  const modeSpecific =
    process.env.NODE_ENV === "development"
      ? env.NEXT_PUBLIC_API_URL_DEV
      : env.NEXT_PUBLIC_API_URL_PROD;
  if (modeSpecific && modeSpecific !== "") return trim(modeSpecific);

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3001";
  }
  return "";
};

export const API_BASE = getApiBase();
export const API_V1 = "/api/v1";

export interface ApiError {
  detail: string | { msg?: string; loc?: unknown[] }[];
  status: number;
}

const RATE_LIMIT_MESSAGE = "Too many attempts. Please try again later.";

/**
 * Normalize API error into a single user-facing message.
 * Handles 429 (rate limit), detail as string or validation array, and non-API errors (e.g. network).
 */
export function getApiErrorMessage(
  err: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (err === null || err === undefined) return fallback;
  const apiErr = err as ApiError;
  if (typeof apiErr.status === "number" && apiErr.status === 429)
    return RATE_LIMIT_MESSAGE;
  if (typeof apiErr.detail === "string" && apiErr.detail) {
    if (apiErr.status === 401 && apiErr.detail === "Unauthorized")
      return "Invalid email or password";
    return apiErr.detail;
  }
  if (Array.isArray(apiErr.detail) && apiErr.detail.length > 0) {
    const first = apiErr.detail[0];
    const msg =
      first &&
      typeof first === "object" &&
      typeof (first as { msg?: string }).msg === "string"
        ? (first as { msg: string }).msg
        : null;
    if (msg) return msg;
  }
  return fallback;
}

/** Validation detail item (e.g. FastAPI 422). */
type ValidationItem = { loc?: unknown[]; msg?: string };

/**
 * Extract field-level errors from a 422 validation response.
 * detail is expected to be an array of { loc: ["body", "field_name"], msg: "..." }.
 * Returns a map of field name (e.g. "username") to message.
 */
export function getApiFieldErrors(err: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (err === null || err === undefined) return out;
  const apiErr = err as ApiError;
  if (apiErr.status !== 422 || !Array.isArray(apiErr.detail)) return out;
  for (const item of apiErr.detail as ValidationItem[]) {
    if (!item || typeof item !== "object") continue;
    const msg = typeof item.msg === "string" ? item.msg : "";
    const loc = Array.isArray(item.loc) ? item.loc : [];
    const last = loc[loc.length - 1];
    const field: string | null = typeof last === "string" ? last : null;
    if (field && msg) out[field] = msg;
  }
  return out;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, ...init } = options;
  const base = API_BASE || "";
  const url = base ? `${base}${path}` : path;
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (
    !headers.has("Content-Type") &&
    init.body &&
    typeof init.body === "string"
  ) {
    headers.set("Content-Type", "application/json");
  }
  const res = await fetch(url, { ...init, headers });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let data: any = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  if (!res.ok) {
    const raw =
      typeof data.detail === "string"
        ? data.detail
        : (typeof data.message === "string" ? data.message : null) ??
          data.detail?.[0]?.msg ??
          res.statusText;
    const detail =
      res.status === 401 && (raw === "Unauthorized" || !raw)
        ? "Invalid email or password"
        : raw;
    throw { detail, status: res.status } as ApiError;
  }
  return data as T;
}

// Minimal snake_case -> camelCase transform for legacy API responses.
// Only keys with "_" are converted; camelCase keys are preserved.
export function snakeToCamel<T>(input: T): T {
  if (Array.isArray(input)) {
    return input.map((item) => snakeToCamel(item)) as T;
  }
  if (input && typeof input === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
      const camelKey = key.replace(/_([a-z])/g, (_, c: string) =>
        c.toUpperCase()
      );
      out[camelKey] = snakeToCamel(value);
    }
    return out as T;
  }
  return input;
}
