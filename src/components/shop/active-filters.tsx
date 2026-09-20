import Link from "next/link";

// Active filter chips with per-filter removal (spec section 2).
export function ActiveFilters({ filters }: { filters: Array<{ key: string; label: string; value: string }> }) {
  if (filters.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {filters.map((f) => (
        <Link
          key={f.key}
          href={`?remove-filter=${f.key}`}
          scroll={false}
          className="glass px-3 py-1 rounded-full text-xs flex items-center gap-1.5 hover:bg-white/10"
          aria-label={`Remove filter ${f.label}`}
        >
          {f.label}: {f.value} <span aria-hidden="true">×</span>
        </Link>
      ))}
      <Link href="/shop" className="text-xs text-white/50 hover:text-white underline">Clear all</Link>
    </div>
  );
}
