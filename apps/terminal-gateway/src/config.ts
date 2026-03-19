import dotenv from 'dotenv';
import path from 'path';

// Load shared local defaults first, then allow `.env.local` to override them.
// In Docker/ECS, injected env vars still take precedence.
const explicitEnvFile = process.env.TERMINAL_GATEWAY_ENV_FILE;
if (explicitEnvFile) {
  dotenv.config({ path: explicitEnvFile });
} else {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
  dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true });
}

export function requireSessionSecret(): string {
  const s = process.env.ENV_SESSION_SECRET || process.env.JWT_SECRET;
  if (!s) throw new Error('ENV_SESSION_SECRET (or JWT_SECRET) must be set');
  return s;
}

export function port(): number {
  return Number(process.env.PORT || 3403);
}
