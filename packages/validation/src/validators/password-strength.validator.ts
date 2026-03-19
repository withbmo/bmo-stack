import { zxcvbn, zxcvbnOptions, ZxcvbnResult } from '@zxcvbn-ts/core';
import type { PasswordStrengthResponse } from '@pytholit/contracts';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';
import { PASSWORD_STRENGTH_CONFIG } from '../config/password-strength.config';

// Load dictionaries and keyboard graphs so scoring works correctly.
// Without this, @zxcvbn-ts/core runs with empty dictionaries and only detects
// keyboard patterns — it will miss common passwords like "password123".
zxcvbnOptions.setOptions({
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  translations: zxcvbnEnPackage.translations,
});

function hasUpperAndLower(password: string): boolean {
  return /[a-z]/.test(password) && /[A-Z]/.test(password);
}

function hasNumber(password: string): boolean {
  return /\d/.test(password);
}

function hasSymbol(password: string): boolean {
  return /[^A-Za-z0-9]/.test(password);
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

/**
 * Validates password strength by throwing an error if it doesn't meet requirements.
 * Used in server-side validation hooks.
 *
 * @throws {Error} If password is too weak
 */
export function validatePasswordStrength(password: string): void {
  // Check minimum length first
  if (!password || password.length < PASSWORD_STRENGTH_CONFIG.OPTIONS.minLength) {
    throw new Error(
      `Password must be at least ${PASSWORD_STRENGTH_CONFIG.OPTIONS.minLength} characters long`
    );
  }

  const result: ZxcvbnResult = zxcvbn(password);

  if (result.score < PASSWORD_STRENGTH_CONFIG.MIN_SCORE) {
    const feedback = result.feedback.suggestions?.[0] || 'Choose a stronger password';
    throw new Error(
      `Password is too weak. ${feedback}. Current strength: ${PASSWORD_STRENGTH_CONFIG.SCORE_LABELS[result.score]}`
    );
  }
}

/**
 * Get detailed password strength info (for API responses)
 */
export function getPasswordStrength(password: string): PasswordStrengthResponse {
  const result: ZxcvbnResult = zxcvbn(password);
  const warning = result.feedback.warning || null;
  const weaknesses = unique([
    ...(!password || password.length < PASSWORD_STRENGTH_CONFIG.OPTIONS.minLength
      ? [`Password must be at least ${PASSWORD_STRENGTH_CONFIG.OPTIONS.minLength} characters long`]
      : []),
    ...(warning ? [warning] : []),
    ...(result.feedback.suggestions || []),
  ]);
  const strengths = unique([
    ...(password.length >= PASSWORD_STRENGTH_CONFIG.OPTIONS.minLength ? ['At least 8 characters long'] : []),
    ...(hasUpperAndLower(password) ? ['Mixes uppercase and lowercase letters'] : []),
    ...(hasNumber(password) ? ['Includes numbers'] : []),
    ...(hasSymbol(password) ? ['Includes symbols'] : []),
    ...(result.score >= PASSWORD_STRENGTH_CONFIG.MIN_SCORE ? ['Strong enough for account security'] : []),
  ]);

  return {
    score: result.score,
    label: PASSWORD_STRENGTH_CONFIG.SCORE_LABELS[result.score],
    crackTime: result.crackTimesDisplay.offlineSlowHashing1e4PerSecond,
    feedback: result.feedback.suggestions || [],
    strengths,
    weaknesses,
    warning,
    isStrong: result.score >= PASSWORD_STRENGTH_CONFIG.MIN_SCORE,
  };
}
