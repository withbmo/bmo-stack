import { normalizeEmailOrNull } from '@pytholit/validation';
import type { AuthHookContext } from '@thallesp/nestjs-better-auth';

export function extractNormalizedEmail(ctx: AuthHookContext): string | null {
  const raw = (ctx as { body?: { email?: unknown } }).body?.email;
  return normalizeEmailOrNull(raw);
}
