import { ConfigService } from '@nestjs/config';

import type { PasswordStrengthResponse } from '@pytholit/contracts';
import { AuthController } from '../../src/auth/auth.controller';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(() => {
    const configService = new ConfigService();
    controller = new AuthController(configService);
  });

  it('returns a password strength response shape', () => {
    const body = { password: 'MyPassword123!' };

    const result = controller.checkPasswordStrength(body) as PasswordStrengthResponse;

    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('label');
    expect(result).toHaveProperty('crackTime');
    expect(result).toHaveProperty('feedback');
    expect(result).toHaveProperty('strengths');
    expect(result).toHaveProperty('weaknesses');
    expect(result).toHaveProperty('warning');
    expect(result).toHaveProperty('isStrong');
  });

  it('treats empty passwords as weak', () => {
    const body = { password: '' };

    const result = controller.checkPasswordStrength(body);

    expect(result.isStrong).toBe(false);
    expect(result.weaknesses.length).toBeGreaterThan(0);
  });
});
