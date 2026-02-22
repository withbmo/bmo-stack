import dotenv from 'dotenv';
import path from 'path';

// Load local env file for `pnpm --filter @pytholit/terminal-gateway dev`.
// In Docker/ECS, env vars are injected and this is a no-op.
dotenv.config({
  path: process.env.TERMINAL_GATEWAY_ENV_FILE || path.resolve(__dirname, '../.env'),
});

export function requireSessionSecret(): string {
  const s = process.env.ENV_SESSION_SECRET || process.env.JWT_SECRET;
  if (!s) throw new Error('ENV_SESSION_SECRET (or JWT_SECRET) must be set');
  return s;
}

export function port(): number {
  return Number(process.env.PORT || 3403);
}
