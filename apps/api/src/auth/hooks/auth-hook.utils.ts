import type { AuthHookContext } from '@thallesp/nestjs-better-auth';

export function extractNormalizedEmail(ctx: AuthHookContext): string | null {
  const raw = (ctx as { body?: { email?: unknown } }).body?.email;
  if (typeof raw !== 'string') return null;
  const normalized = raw.trim().toLowerCase();
  return normalized.length > 0 ? normalized : null;
}
