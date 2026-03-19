import dotenv from 'dotenv';
import path from 'path';

// Load shared local defaults first, then allow `.env.local` to override them.
// In containerized or managed environments, injected env vars still take precedence.
const explicitEnvFile = process.env.INGRESS_ROUTER_ENV_FILE;
if (explicitEnvFile) {
  dotenv.config({ path: explicitEnvFile });
} else {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
  dotenv.config({ path: path.resolve(__dirname, '../.env.local'), override: true });
}

export function tokenSecret(): string {
  const secret = process.env.ENV_SESSION_SECRET || process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('ENV_SESSION_SECRET (or JWT_SECRET) must be set');
  }
  return secret;
}

export function port(): number {
  return Number(process.env.PORT || 3402);
}
