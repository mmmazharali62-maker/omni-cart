"use client";

import Link from "next/link";
import { useCompare } from "@/hooks/use-compare";

// Floating compare tray (spec section 3): max 4 products, always reachable.
export function CompareTray() {
  const { items, remove, clear } = useCompare();

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 z-40 glass rounded-xl p-3 flex items-center gap-3 max-w-xl">
      <span className="text-xs text-white/50 shrink-0">{items.length}/4</span>
      <ul className="flex gap-2 overflow-x-auto flex-1">
        {items.map((t) => (
          <li key={t} className="glass px-2 py-1 rounded-lg text-xs whitespace-nowrap flex items-center gap-1">
            {t.length > 18 ? `${t.slice(0, 18)}...` : t}
            <button onClick={() => remove(t)} aria-label={`Remove ${t} from comparison`} className="text-white/40 hover:text-white">×</button>
          </li>
        ))}
      </ul>
      <button onClick={clear} className="text-xs text-white/40 hover:text-white shrink-0">Clear</button>
      {items.length >= 2 && (
        <Link href="/compare" className="bg-brand-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium shrink-0">
          Compare
        </Link>
      )}
    </div>
  );
}
