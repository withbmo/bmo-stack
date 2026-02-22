/**
 * Database utility functions
 */

/**
 * Exclude fields from an object (useful for removing sensitive fields)
 */
export function exclude<T, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}
