/**
 * @/ui
 *
 * Compatibility-only flat entrypoint for legacy consumers.
 *
 * New code should prefer:
 * - `@/ui`
 * - `@/ui/blocks`
 *
 * This barrel intentionally remains available to avoid breaking older imports,
 * but it collapses the architecture boundary and should not be used for new
 * application code.
 */
export * from './blocks';
export * from './system';
export * from './ui';
