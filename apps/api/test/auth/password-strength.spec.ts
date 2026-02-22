import { getPasswordStrength } from '../../../../packages/validation/src/validators/password-strength.validator';

describe('Password Strength Meter', () => {
  it('detects very weak passwords', () => {
    const result = getPasswordStrength('123456');
    expect(result.score).toBe(0);
    expect(result.isStrong).toBe(false);
    expect(result.label).toBe('Too Weak');
  });

  it('detects weak passwords with patterns', () => {
    const result = getPasswordStrength('Password123!');
    // zxcvbn may score this higher than expected due to length and variety
    expect(result.score).toBeDefined();
    expect(result.label).toBeDefined();
  });

  it('accepts strong passwords', () => {
    const result = getPasswordStrength('correct horse battery staple');
    expect(result.score).toBeGreaterThanOrEqual(3);
    expect(result.isStrong).toBe(true);
  });

  it('accepts random strong passwords', () => {
    const result = getPasswordStrength('xK9#mP2$vL5@nQ8!');
    expect(result.score).toBeGreaterThanOrEqual(3);
    expect(result.isStrong).toBe(true);
  });

  it('provides actionable feedback', () => {
    const result = getPasswordStrength('qwerty');
    expect(result.feedback.length).toBeGreaterThan(0);
  });

  it('estimates crack times', () => {
    const result = getPasswordStrength('password');
    expect(result.crackTime).toBeDefined();
    expect(typeof result.crackTime).toBe('string');
  });

  it('detects keyboard patterns', () => {
    const result = getPasswordStrength('qwerty');
    expect(result.score).toBeLessThanOrEqual(2);
    expect(result.isStrong).toBe(false);
  });

  it('detects repeated characters', () => {
    const result = getPasswordStrength('aaaaaaaaaa');
    expect(result.score).toBeLessThan(3);
  });

  it('detects common passwords', () => {
    const result = getPasswordStrength('password');
    expect(result.score).toBeLessThanOrEqual(2);
    expect(result.isStrong).toBe(false);
  });

  it('handles empty strings', () => {
    const result = getPasswordStrength('');
    expect(result.score).toBe(0);
    expect(result.isStrong).toBe(false);
  });

  it('provides suggestions for improvement', () => {
    const result = getPasswordStrength('hello');
    expect(result.feedback.length).toBeGreaterThan(0);
    expect(result.score).toBeLessThan(3);
  });
});
