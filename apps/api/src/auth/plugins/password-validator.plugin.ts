import { validatePasswordStrength } from '@pytholit/validation';

/** Validates a password field using the shared validation library. */
function validatePasswordField(body: unknown, key: 'password' | 'newPassword'): void {
  if (!body || typeof body !== 'object') return;
  const value = (body as Record<string, unknown>)[key];
  if (typeof value === 'string') {
    validatePasswordStrength(value);
  }
}

/** Better Auth plugin that enforces password strength on sign-up and reset. */
export const passwordValidatorPlugin = (): any => {
  return {
    id: 'password-validator',
    hooks: {
      before: [
        {
          matcher(context: any) {
            return (
              context.path.includes('/sign-up/email') || context.path.includes('/reset-password')
            );
          },
          handler: async (ctx: any) => {
            const { createAuthMiddleware } = await import('better-auth/api');
            return createAuthMiddleware(async (innerCtx: any) => {
              if (innerCtx.path.includes('/sign-up/email')) {
                validatePasswordField(innerCtx.body, 'password');
              } else if (innerCtx.path.includes('/reset-password')) {
                validatePasswordField(innerCtx.body, 'newPassword');
              }
              return { context: innerCtx };
            })(ctx);
          },
        },
      ],
    },
  };
};
