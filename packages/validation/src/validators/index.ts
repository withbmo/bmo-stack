/**
 * Custom validators
 *
 * validatePasswordStrength - Throws error if password is too weak (server-side validation)
 * getPasswordStrength - Returns detailed password strength analysis
 * zxcvbn - Password strength estimator (re-exported for convenience)
 */

export { zxcvbn, type ZxcvbnResult } from '@zxcvbn-ts/core';
export { getPasswordStrength, validatePasswordStrength } from './password-strength.validator';
