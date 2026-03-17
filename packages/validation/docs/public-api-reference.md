# Public API Reference

## Root entry: `@pytholit/validation`

### `AUTH_CONSTANTS`

Shared auth validation rules:

- `MIN_PASSWORD_LENGTH`
- `MAX_PASSWORD_LENGTH`
- `MIN_USERNAME_LENGTH`
- `MAX_USERNAME_LENGTH`
- `MAX_EMAIL_LENGTH`
- `MAX_NAME_LENGTH`
- `USERNAME_REGEX`

Used by:

- API user-related DTOs
- web auth form validation

### `PROJECT_CONSTANTS`

Shared project validation rules:

- `MIN_NAME_LENGTH`
- `MAX_NAME_LENGTH`
- `MIN_SLUG_LENGTH`
- `MAX_SLUG_LENGTH`
- `SLUG_REGEX`

Used by:

- API project DTOs

### `normalizeEmailOrNull(value)`

Normalizes unknown input into a trimmed, lowercased email string.

Behavior:

- returns `null` if the value is not a string
- trims whitespace
- lowercases the string
- returns `null` if the normalized value is empty

Used by:

- API auth hook utilities

### `validatePasswordStrength(password)`

Runs password-strength enforcement and throws when the password is too weak.

Behavior:

- checks minimum length
- runs `zxcvbn`
- throws with a user-facing error message when the password does not meet the required score

Used by:

- API password validation plugin

### `getPasswordStrength(password)`

Returns a password-strength analysis object for API responses and frontend UX.

Returned shape:

- `score`
- `label`
- `crackTime`
- `feedback`
- `isStrong`

Used by:

- API auth helper endpoint for password-strength checks

### `zxcvbn`

The configured password-strength estimator is re-exported for convenience.

## Frontend entry: `@pytholit/validation/zod`

This entry point currently re-exports the shared validation constants from the package.

It is intended as a frontend-friendly import path and does not currently expose actual Zod schemas.
