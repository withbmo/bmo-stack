/**
 * Central OAuth provider registry.
 *
 * To add a new provider: add one entry here. Nothing else needs to change —
 * the provider will automatically appear in:
 *   - GET /api/v1/auth-flow/providers  (frontend capability discovery)
 *   - Better Auth socialProviders       (actual OAuth flow)
 *   - providerGatePlugin                (blocks disabled providers server-side)
 *
 * Each entry maps the Better Auth provider key to the env-var pair that
 * signals the provider is configured. If either var is missing/empty the
 * provider is treated as disabled.
 */
export interface OAuthProviderDef {
  /** Env var holding the client ID */
  clientIdKey: string;
  /** Env var holding the client secret */
  clientSecretKey: string;
  /** Env var holding the redirect/callback URL (optional) */
  callbackUrlKey?: string;
}

/** Registry: provider name → required env vars. Add providers here only. */
export const OAUTH_PROVIDERS = {
  google: {
    clientIdKey: 'GOOGLE_CLIENT_ID',
    clientSecretKey: 'GOOGLE_CLIENT_SECRET',
    callbackUrlKey: 'GOOGLE_CALLBACK_URL',
  },
  github: {
    clientIdKey: 'GITHUB_CLIENT_ID',
    clientSecretKey: 'GITHUB_CLIENT_SECRET',
    callbackUrlKey: 'GITHUB_CALLBACK_URL',
  },
} as const satisfies Record<string, OAuthProviderDef>;

export type OAuthProviderKey = keyof typeof OAUTH_PROVIDERS;
