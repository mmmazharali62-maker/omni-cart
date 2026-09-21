// Skeleton for streaming product rails (homepage performance pass).
export function RailSkeleton({ cards = 4 }: { cards?: number }) {
  return (
    <section className="mx-4 mt-16" aria-hidden="true">
      <div className="h-8 w-48 rounded-lg bg-white/5 animate-pulse mb-6" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array.from({ length: cards }).map((_, i) => (
          <div key={i} className="glass p-0 overflow-hidden">
            <div className="aspect-square bg-white/5 animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-3/4 rounded bg-white/5 animate-pulse" />
              <div className="h-4 w-1/4 rounded bg-white/5 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
