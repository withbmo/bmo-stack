/**
 * Normalizes email values for consistent auth and identity operations.
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Safely normalizes unknown email input and returns null when invalid/empty.
 */
export function normalizeEmailOrNull(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const normalized = normalizeEmail(value);
  return normalized.length > 0 ? normalized : null;
}
