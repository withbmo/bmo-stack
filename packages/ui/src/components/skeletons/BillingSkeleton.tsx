export const BillingSkeleton = () => (
  <div className="space-y-10 animate-pulse">
    <div className="space-y-2">
      <div className="h-3 w-40 bg-border-dim/30" />
      <div className="h-8 w-72 bg-border-dim/20" />
      <div className="h-3 w-56 bg-border-dim/20" />
    </div>

    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="bg-bg-panel border border-border-dim p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-3 w-24 bg-border-dim/30" />
            <div className="h-8 w-36 bg-border-dim/20" />
          </div>
          <div className="h-8 w-28 bg-border-dim/20" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="h-3 w-40 bg-border-dim/20" />
          <div className="h-3 w-36 bg-border-dim/20" />
          <div className="h-3 w-44 bg-border-dim/20" />
          <div className="h-3 w-32 bg-border-dim/20" />
        </div>
      </div>

      <div className="bg-bg-panel border border-border-dim p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-3 w-28 bg-border-dim/30" />
            <div className="h-3 w-40 bg-border-dim/20" />
          </div>
          <div className="h-8 w-24 bg-border-dim/20" />
        </div>
        <div className="h-20 bg-border-dim/10 border border-border-dim/40" />
        <div className="h-3 w-32 bg-border-dim/20" />
      </div>
    </div>

    <div className="space-y-4">
      <div className="h-3 w-44 bg-border-dim/20" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-24 bg-border-dim/10 border border-border-dim/40" />
        <div className="h-24 bg-border-dim/10 border border-border-dim/40" />
        <div className="h-24 bg-border-dim/10 border border-border-dim/40" />
      </div>
    </div>
  </div>
);
