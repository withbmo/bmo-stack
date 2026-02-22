import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { zxcvbn, ZxcvbnResult } from '@zxcvbn-ts/core';
import { PASSWORD_STRENGTH_CONFIG } from '../config/password-strength.config';

// zxcvbn will use default dictionaries if no options provided

/**
 * Custom validator that checks password strength using zxcvbn
 */
export function IsStrongPassword(
  minScore: number = PASSWORD_STRENGTH_CONFIG.MIN_SCORE,
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string): boolean {
          if (!value || typeof value !== 'string') return false;

          // Check minimum length first
          if (value.length < PASSWORD_STRENGTH_CONFIG.OPTIONS.minLength) {
            return false;
          }

          const result: ZxcvbnResult = zxcvbn(value);
          return result.score >= minScore;
        },

        defaultMessage(args: ValidationArguments): string {
          const value = args.value as string;

          if (!value || value.length < PASSWORD_STRENGTH_CONFIG.OPTIONS.minLength) {
            return `Password must be at least ${PASSWORD_STRENGTH_CONFIG.OPTIONS.minLength} characters long`;
          }

          const result: ZxcvbnResult = zxcvbn(value);
          const feedback = result.feedback.suggestions?.[0] || 'Choose a stronger password';

          return `Password is too weak. ${feedback}. Current strength: ${PASSWORD_STRENGTH_CONFIG.SCORE_LABELS[result.score]}`;
        },
      },
    });
  };
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
