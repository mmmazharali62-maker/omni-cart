// Shimmer skeleton for product grids while server components resolve.
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="aspect-square rounded-2xl bg-white/10" />
          <div className="h-4 rounded-lg bg-white/10 mt-3 w-3/4" />
          <div className="h-4 rounded-lg bg-white/10 mt-2 w-1/4" />
        </div>
      ))}
    </div>
  );
}
