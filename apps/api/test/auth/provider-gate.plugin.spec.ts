import { ConfigService } from '@nestjs/config';

import { providerGatePlugin } from '../../src/auth/plugins/provider-gate.plugin';

describe('providerGatePlugin', () => {
  const makeConfig = (vals: Record<string, string | undefined>) => {
    const cfg = new ConfigService(vals);
    return cfg;
  };

  it('allows enabled providers', async () => {
    const config = makeConfig({
      GOOGLE_CLIENT_ID: 'id',
      GOOGLE_CLIENT_SECRET: 'secret',
    });
    const plugin = providerGatePlugin(config);
    const beforeHook = plugin.hooks.before[0];

    const ctx: any = {
      path: '/sign-in/social',
      body: { provider: 'google' },
    };

    await expect(beforeHook.handler(ctx)).resolves.toBeDefined();
  });

  it('rejects disabled providers', async () => {
    const config = makeConfig({});
    const plugin = providerGatePlugin(config);
    const beforeHook = plugin.hooks.before[0];

    const ctx: any = {
      path: '/sign-in/social',
      body: { provider: 'google' },
    };

    await expect(beforeHook.handler(ctx)).rejects.toHaveProperty(
      'code',
      'AUTH_OAUTH_PROVIDER_DISABLED'
    );
  });
});
