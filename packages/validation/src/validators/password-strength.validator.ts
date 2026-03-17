import { zxcvbn, zxcvbnOptions, ZxcvbnResult } from '@zxcvbn-ts/core';
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
export function getPasswordStrength(password: string): {
  score: number;
  label: string;
  crackTime: string;
  feedback: string[];
  isStrong: boolean;
} {
  const result: ZxcvbnResult = zxcvbn(password);

  return {
    score: result.score,
    label: PASSWORD_STRENGTH_CONFIG.SCORE_LABELS[result.score],
    crackTime: result.crackTimesDisplay.offlineSlowHashing1e4PerSecond,
    feedback: result.feedback.suggestions || [],
    isStrong: result.score >= PASSWORD_STRENGTH_CONFIG.MIN_SCORE,
  };
}
