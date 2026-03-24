import type { ConfigService } from '@nestjs/config';

import { OAUTH_PROVIDERS, type OAuthProviderKey } from '../auth-providers.config.js';

/** Checks if an OAuth provider is fully configured with client ID and secret. */
const isProviderEnabled = (configService: ConfigService, key: OAuthProviderKey): boolean => {
  const def = OAUTH_PROVIDERS[key];
  return (
    Boolean(configService.get<string>(def.clientIdKey)) &&
    Boolean(configService.get<string>(def.clientSecretKey))
  );
};

/** Better Auth plugin that blocks sign-in via OAuth providers without credentials. */
export const providerGatePlugin = (configService: ConfigService): any => {
  return {
    id: 'provider-gate',
    hooks: {
      before: [
        {
          matcher(context: any) {
            return context.path === '/sign-in/social';
          },
          handler: async (ctx: any) => {
            const { APIError, createAuthMiddleware } = await import('better-auth/api');
            return createAuthMiddleware(async (innerCtx: any) => {
              const provider =
                typeof innerCtx?.body?.provider === 'string' ? innerCtx.body.provider : '';
              const isKnown = Object.prototype.hasOwnProperty.call(OAUTH_PROVIDERS, provider);

              if (!isKnown || !isProviderEnabled(configService, provider as OAuthProviderKey)) {
                throw new APIError('BAD_REQUEST', {
                  code: 'AUTH_OAUTH_PROVIDER_DISABLED',
                  detail: `OAuth provider '${provider}' is disabled.`,
                });
              }

              return { context: innerCtx };
            })(ctx);
          },
        },
      ],
    },
  };
};
