/**
 * Password strength configuration using zxcvbn
 *
 * Score meanings:
 * 0 = Too guessable (less than 10^3 guesses)
 * 1 = Very guessable (less than 10^6 guesses)
 * 2 = Somewhat guessable (less than 10^8 guesses)
 * 3 = Safely unguessable (less than 10^10 guesses)
 * 4 = Very unguessable (more than 10^10 guesses)
 */
export const PASSWORD_STRENGTH_CONFIG = {
  // Minimum acceptable score for registration/password reset
  MIN_SCORE: 3, // "Strong" - requires ~10^10 guesses

  // Minimum score for sensitive operations
  MIN_SCORE_SENSITIVE: 4, // "Very Strong"

  // Options for zxcvbn
  OPTIONS: {
    // Minimum password length to even check
    minLength: 8,

    // Whether to use a bloom filter for common passwords (performance)
    useBloomFilter: true,
  },

  // Score labels for user feedback
  SCORE_LABELS: {
    0: 'Too Weak',
    1: 'Weak',
    2: 'Fair',
    3: 'Strong',
    4: 'Very Strong',
  },

  // Colors for UI (if needed on backend)
  SCORE_COLORS: {
    0: '#dc2626', // red-600
    1: '#ea580c', // orange-600
    2: '#ca8a04', // yellow-600
    3: '#16a34a', // green-600
    4: '#15803d', // green-700
  },
} as const;
