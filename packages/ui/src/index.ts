/**
 * @pytholit/ui
 *
 * Backward-compatible flat entrypoint for the full package.
 * Prefer subpath imports (`@pytholit/ui/ui` and `@pytholit/ui/blocks`)
 * when you want to preserve the architectural distinction in app code.
 */

// Utilities
export { cn } from './utils/cn';

// Types
export type * from './types';

// Components
export * from './components';

// Motion
export * from './motion';
