import { Skeleton } from '../Skeleton';

/**
 * Loading skeleton for the Environments page.
 * Displays placeholder environment cards in a grid layout while data is being fetched.
 */
export const EnvironmentsSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
    {/* Render 4 skeleton environment cards */}
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="bg-bg-panel border border-border-dim p-6 space-y-5">
        {/* Header section */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-3 w-32 mt-2" />
          </div>
          <Skeleton className="h-6 w-16" />
        </div>

        {/* Form fields section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 flex-1" />
            </div>
          </div>
        </div>

        {/* Deploy button section */}
        <div className="pt-2">
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
    ))}
  </div>
);
