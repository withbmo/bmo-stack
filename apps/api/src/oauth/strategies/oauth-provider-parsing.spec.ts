import {
  parseGithubPassportProfile,
  parseGoogleOAuthProfile,
  pickVerifiedGithubEmail,
} from '@pytholit/validation/zod';

describe('OAuth provider parsing (zod)', () => {
  describe('Google', () => {
    it('parses a valid Google passport profile', () => {
      const profile = {
        id: 'google-123',
        emails: [{ value: 'user@example.com' }],
        displayName: 'User Example',
        name: { givenName: 'User', familyName: 'Example' },
        photos: [{ value: 'https://lh3.googleusercontent.com/a/photo' }],
        _json: { email_verified: true },
      };

      const parsed = parseGoogleOAuthProfile(profile);
      expect(parsed.id).toBe('google-123');
      expect(parsed.email).toBe('user@example.com');
      expect(parsed.emailVerified).toBe(true);
      expect(parsed.firstName).toBe('User');
      expect(parsed.lastName).toBe('Example');
      expect(parsed.avatarUrl).toBe('https://lh3.googleusercontent.com/a/photo');
    });

    it('fails closed on missing emails', () => {
      const profile = { id: 'google-123', emails: [] };
      expect(() => parseGoogleOAuthProfile(profile)).toThrow();
    });
  });

  describe('GitHub', () => {
    it('parses a valid GitHub passport profile', () => {
      const profile = {
        id: 'github-123',
        displayName: 'User Example',
        username: 'userexample',
        photos: [{ value: 'https://avatars.githubusercontent.com/u/1?v=4' }],
      };
      const parsed = parseGithubPassportProfile(profile);
      expect(parsed.id).toBe('github-123');
      expect(parsed.displayName).toBe('User Example');
      expect(parsed.username).toBe('userexample');
      expect(parsed.avatarUrl).toBe('https://avatars.githubusercontent.com/u/1?v=4');
    });

    it('fails closed on malformed profile', () => {
      expect(() => parseGithubPassportProfile({})).toThrow();
    });

    it('picks primary+verified email first', () => {
      const json = [
        { email: 'a@example.com', verified: true, primary: false },
        { email: 'b@example.com', verified: true, primary: true },
        { email: 'c@example.com', verified: false, primary: false },
      ];
      expect(pickVerifiedGithubEmail(json)).toBe('b@example.com');
    });

    it('falls back to any verified email', () => {
      const json = [
        { email: 'a@example.com', verified: true, primary: false },
        { email: 'b@example.com', verified: false, primary: true },
      ];
      expect(pickVerifiedGithubEmail(json)).toBe('a@example.com');
    });

    it('returns null when no verified email exists', () => {
      const json = [
        { email: 'a@example.com', verified: false, primary: true },
        { email: 'b@example.com', verified: false, primary: false },
      ];
      expect(pickVerifiedGithubEmail(json)).toBeNull();
    });
  });
});

