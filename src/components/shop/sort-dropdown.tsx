"use client";

import { useRouter, useSearchParams } from "next/navigation";

// Sort control, URL-synced (spec section 2).
const OPTIONS = [
  ["featured", "Featured"],
  ["newest", "Newest"],
  ["price_asc", "Price: Low to High"],
  ["price_desc", "Price: High to Low"],
  ["rating", "Top Rated"]
] as const;

export function SortDropdown() {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get("sort") ?? "featured";

  return (
    <select
      value={current}
      onChange={(e) => {
        const sp = new URLSearchParams(params.toString());
        if (e.target.value === "featured") sp.delete("sort");
        else sp.set("sort", e.target.value);
        router.push(`/shop?${sp.toString()}`);
      }}
      aria-label="Sort products"
      className="glass bg-white/5 px-3 py-2 rounded-lg text-sm outline-none"
    >
      {OPTIONS.map(([value, label]) => (
        <option key={value} value={value}>{label}</option>
      ))}
    </select>
  );
}
