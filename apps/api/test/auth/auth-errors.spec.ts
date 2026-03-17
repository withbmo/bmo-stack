import {
  throwAccountInactive,
  throwAdminRequired,
  throwEmailUnverified,
  throwForbidden,
  throwUnauthenticated,
} from '../../src/auth/errors/auth-errors';

describe('auth error helpers', () => {
  it('throws unauthenticated error with correct shape', () => {
    try {
      throwUnauthenticated();
      fail('Expected throwUnauthenticated to throw');
    } catch (err: any) {
      expect(err.getStatus()).toBe(401);
      expect(err.response.code).toBe('AUTH_UNAUTHENTICATED');
    }
  });

  it('throws forbidden error with provided code', () => {
    try {
      throwForbidden('TEST_CODE', 'detail');
      fail('Expected throwForbidden to throw');
    } catch (err: any) {
      expect(err.getStatus()).toBe(403);
      expect(err.response.code).toBe('TEST_CODE');
    }
  });

  it('throws email unverified error', () => {
    try {
      throwEmailUnverified();
      fail('Expected throwEmailUnverified to throw');
    } catch (err: any) {
      expect(err.getStatus()).toBe(403);
      expect(err.response.code).toBe('AUTH_EMAIL_UNVERIFIED');
    }
  });

  it('throws account inactive error', () => {
    try {
      throwAccountInactive();
      fail('Expected throwAccountInactive to throw');
    } catch (err: any) {
      expect(err.getStatus()).toBe(403);
      expect(err.response.code).toBe('AUTH_ACCOUNT_INACTIVE');
    }
  });

  it('throws admin required error', () => {
    try {
      throwAdminRequired();
      fail('Expected throwAdminRequired to throw');
    } catch (err: any) {
      expect(err.getStatus()).toBe(403);
      expect(err.response.code).toBe('AUTH_ADMIN_REQUIRED');
    }
  });
});
