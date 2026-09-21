"use client";

import { useMemo, useState } from "react";
import { tokenize } from "@/lib/search/tokenize";

export type FaqItem = { q: string; a: string };

// Instant FAQ search (spec section 2/19): tokenize + simple matching.
export function FaqSearch({ items }: { items: FaqItem[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (query.trim().length < 2) return items.slice(0, 6);
    const tokens = tokenize(query);
    return items
      .map((item) => {
        const text = `${item.q} ${item.a}`.toLowerCase();
        return { item, score: tokens.reduce((s, t) => s + (text.includes(t) ? 1 : 0), 0) };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((r) => r.item);
  }, [items, query]);

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search help articles..."
        aria-label="Search frequently asked questions"
        className="w-full glass bg-white/5 px-4 py-3 rounded-xl text-sm outline-none"
      />
      <ul className="mt-4 space-y-3">
        {results.map((item) => (
          <li key={item.q} className="glass p-4">
            <p className="font-medium text-sm">{item.q}</p>
            <p className="text-sm text-white/60 mt-1">{item.a}</p>
          </li>
        ))}
        {results.length === 0 && (
          <li className="text-sm text-white/50">
            No matches - contact support and we'll answer within 24 hours.
          </li>
        )}
      </ul>
    </div>
  );
}
