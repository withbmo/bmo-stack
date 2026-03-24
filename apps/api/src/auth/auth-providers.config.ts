/** Central OAuth provider registry used across auth config and plugins. */
interface OAuthProviderDef {
  clientIdKey: string;
  clientSecretKey: string;
  callbackUrlKey?: string;
}

/** Provider name → required env vars. Add providers here only. */
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
