import test from 'node:test';
import assert from 'node:assert/strict';

import { getPasswordStrength } from '../src/validators/password-strength.validator';

test('empty password returns weak response with minimum-length weakness', () => {
  const result = getPasswordStrength('');

  assert.equal(result.isStrong, false);
  assert.equal(result.warning, null);
  assert.match(result.weaknesses[0] || '', /at least 8 characters long/i);
  assert.deepEqual(result.strengths, []);
});

test('short password includes deterministic weakness prompts', () => {
  const result = getPasswordStrength('Ab1!');

  assert.equal(result.isStrong, false);
  assert.ok(result.weaknesses.some((item) => /at least 8 characters long/i.test(item)));
  assert.ok(result.strengths.includes('Mixes uppercase and lowercase letters'));
  assert.ok(result.strengths.includes('Includes numbers'));
  assert.ok(result.strengths.includes('Includes symbols'));
});

test('strong passphrase returns stable deduplicated strengths', () => {
  const result = getPasswordStrength('Orbit Lantern 42! Cedar Harbor');

  assert.equal(result.isStrong, true);
  assert.ok(result.strengths.includes('At least 8 characters long'));
  assert.ok(result.strengths.includes('Strong enough for account security'));
  assert.equal(new Set(result.strengths).size, result.strengths.length);
  assert.equal(new Set(result.weaknesses).size, result.weaknesses.length);
});

test('warning is null when zxcvbn does not emit one', () => {
  const result = getPasswordStrength('Orbit Lantern 42! Cedar Harbor');

  assert.equal(result.warning, null);
});

test('warning is populated when zxcvbn emits one', () => {
  const result = getPasswordStrength('password123');

  assert.equal(typeof result.warning, 'string');
  assert.ok((result.warning || '').length > 0);
});
