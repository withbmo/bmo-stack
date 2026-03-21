/**
 * Public entrypoint for cross-app system and pattern utilities.
 *
 * These exports are shared and package-owned, but they are not low-level
 * visual primitives. They typically coordinate behavior across screens or
 * applications.
 */
export {
  DynamicSkeletonProvider,
  DynamicSlot,
  useDynamicSkeletonLoading,
} from './components/ui/DynamicSkeleton';
export { toast, Toaster } from './components/ui/Toast';
