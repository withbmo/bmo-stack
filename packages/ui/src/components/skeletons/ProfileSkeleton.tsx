import { Skeleton } from '../Skeleton';

/**
 * Loading skeleton for the Profile Settings tab.
 * Displays placeholder content while user profile data is being fetched.
 */
export const ProfileSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    {/* Header skeleton */}
    <div className="space-y-3">
      <Skeleton className="h-7 w-56" />
      <Skeleton className="h-4 w-48" />
    </div>

    {/* Avatar section skeleton */}
    <div className="flex items-start gap-6 pb-8 border-b border-border-dim/30">
      <Skeleton className="w-32 h-32" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-8 w-28" />
      </div>
    </div>

    {/* Form fields skeleton */}
    <div className="grid grid-cols-1 gap-6">
      <div className="space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-11 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-11 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-11 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>

    {/* Save button skeleton */}
    <Skeleton className="h-11 w-40" />
  </div>
);
