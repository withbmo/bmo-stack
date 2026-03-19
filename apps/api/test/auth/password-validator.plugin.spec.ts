import { validatePasswordStrength } from '@pytholit/validation';

import { passwordValidatorPlugin } from '../../src/auth/plugins/password-validator.plugin';

jest.mock('@pytholit/validation', () => ({
  validatePasswordStrength: jest.fn(),
}));

describe('passwordValidatorPlugin', () => {
  it('validates password on email sign-up', async () => {
    const plugin = passwordValidatorPlugin();
    const beforeHook = plugin.hooks.before[0];

    const ctx: any = {
      path: '/sign-up/email',
      body: { password: 'MyPassword123!' },
    };

    await beforeHook.handler(ctx);

    expect(validatePasswordStrength).toHaveBeenCalledWith('MyPassword123!');
  });

  it('validates newPassword on reset-password', async () => {
    const plugin = passwordValidatorPlugin();
    const beforeHook = plugin.hooks.before[0];

    const ctx: any = {
      path: '/reset-password',
      body: { newPassword: 'NewPassword123!' },
    };

    await beforeHook.handler(ctx);

    expect(validatePasswordStrength).toHaveBeenCalledWith('NewPassword123!');
  });

  it('throws AUTH_WEAK_PASSWORD when validation fails', async () => {
    (validatePasswordStrength as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Password is too weak.');
    });

    const plugin = passwordValidatorPlugin();
    const beforeHook = plugin.hooks.before[0];

    const ctx: any = {
      path: '/sign-up/email',
      body: { password: 'weak' },
    };

    await expect(beforeHook.handler(ctx)).rejects.toMatchObject({
      name: 'APIError',
      body: expect.objectContaining({
        code: 'AUTH_WEAK_PASSWORD',
        detail: 'Password is too weak.',
      }),
    });
  });
});
