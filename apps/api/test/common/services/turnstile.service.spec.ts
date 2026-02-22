import { ConfigService } from '@nestjs/config';

import { TurnstileService } from '../../../src/common/services/turnstile.service';

describe('TurnstileService (localhost bypass)', () => {
  it('bypasses verification when APP_ENV=localhost (even if NODE_ENV=production)', async () => {
    const cfg = new ConfigService({
      APP_ENV: 'localhost',
      NODE_ENV: 'production',
      TURNSTILE_SECRET_KEY: '',
    });

    const svc = new TurnstileService(cfg);
    await expect(svc.verifyToken('')).resolves.toBe(true);
    expect(svc.isDevelopmentMode()).toBe(true);
  });
});
