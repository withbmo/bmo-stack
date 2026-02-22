/**
 * Shared runtime defaults used across API modules.
 * Keep these as a single source of truth to avoid config drift.
 */
export const FRONTEND_URL_DEFAULT = 'http://localhost:3000';
export const API_URL_DEFAULT = 'http://localhost:3001';
export const JWT_SECRET_DEFAULT = 'dev-secret';
export const JWT_EXPIRES_IN_DEFAULT = '15m';
export const UPLOAD_DIR_DEFAULT = 'uploads';
export const ORCHESTRATOR_URL_DEFAULT = 'http://localhost:3003';
export const ORCHESTRATOR_TIMEOUT_MS_DEFAULT = 5_000;
export const ORCHESTRATOR_CIRCUIT_FAILURE_THRESHOLD_DEFAULT = 3;
export const ORCHESTRATOR_CIRCUIT_OPEN_MS_DEFAULT = 30_000;
export const ENV_SESSION_TTL_SECONDS_DEFAULT = 120;
export const TERMINAL_GATEWAY_WS_URL_DEFAULT = 'wss://terminal.pytholit.dev/ws';
export const TERMINAL_TRANSCRIPT_MAX_CHARS_DEFAULT = 200_000;
export const TERMINAL_TRANSCRIPT_MAX_DELTA_CHARS_DEFAULT = 8_192;
export const TMUX_TTL_MINUTES_DEFAULT = 120;
export const TMUX_CLEANUP_ENABLED_DEFAULT = false;
export const TMUX_CLEANUP_INTERVAL_SECONDS_DEFAULT = 300;
export const TMUX_CLEANUP_MAX_TABS_PER_CYCLE_DEFAULT = 50;
export const WIZARD_DEFAULT_VERSION_DEFAULT = '2026.02.08';
export const WIZARD_DEFAULT_TEMPLATE_ID_DEFAULT = 'python-service';
export const WIZARD_LEGACY_TEMPLATE_ID_DEFAULT = 'python-service';
export const EMAIL_DEFAULT_FROM_ADDRESS = 'noreply@pytholit.dev';
export const EMAIL_DEFAULT_FROM_NAME = 'Pytholit';
export const EMAIL_DEFAULT_SMTP_PORT = 587;
export const EMAIL_QUEUE_CONCURRENCY_DEFAULT = 5;
export const EMAIL_QUEUE_RATE_LIMIT_MAX_DEFAULT = 50;
export const EMAIL_QUEUE_RATE_LIMIT_DURATION_MS_DEFAULT = 1000;
export const EMAIL_QUEUE_REMOVE_ON_COMPLETE_DEFAULT = 1000;
export const EMAIL_QUEUE_REMOVE_ON_FAIL_DEFAULT = 5000;

export const AUTH_SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
export const AUTH_SESSION_UPDATE_AGE_SECONDS = 60 * 60 * 24;
