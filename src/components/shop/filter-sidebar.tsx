"use client";

import { useRouter, useSearchParams } from "next/navigation";

// Shop filters: price range + in-stock toggle, URL-synced (spec section 2).
export function FilterSidebar({ maxPrice = 500 }: { maxPrice?: number }) {
  const router = useRouter();
  const params = useSearchParams();
  const min = params.get("min") ?? "";
  const max = params.get("max") ?? "";
  const inStock = params.get("inStock") === "1";

  function apply(next: Record<string, string | null>) {
    const sp = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v === null || v === "") sp.delete(k);
      else sp.set(k, v);
    }
    router.push(`/shop?${sp.toString()}`);
  }

  return (
    <aside className="glass p-5 h-fit space-y-5">
      <div>
        <p className="text-sm font-medium mb-2">Price range</p>
        <div className="flex gap-2">
          <input type="number" defaultValue={min} placeholder={`$0`} min={0}
            onBlur={(e) => apply({ min: e.target.value })}
            className="w-full glass bg-white/5 px-2 py-1.5 rounded-lg text-sm outline-none" />
          <input type="number" defaultValue={max} placeholder={`$${maxPrice}`} min={0}
            onBlur={(e) => apply({ max: e.target.value })}
            className="w-full glass bg-white/5 px-2 py-1.5 rounded-lg text-sm outline-none" />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" checked={inStock} onChange={(e) => apply({ inStock: e.target.checked ? "1" : null })} />
        In stock only
      </label>
      <button onClick={() => router.push("/shop")} className="text-xs text-white/50 hover:text-white">
        Clear all filters
      </button>
    </aside>
  );
}
