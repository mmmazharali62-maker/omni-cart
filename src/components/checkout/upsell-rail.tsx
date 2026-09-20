"use client";

import { useState } from "react";
import { useCartCount } from "@/hooks/use-cart-count";

type Upsell = { productId: string; title: string; price: number; image?: string | null };

// Checkout upsell rail (spec section 15): add impulse items without leaving checkout.
export function UpsellRail({ upsells }: { upsells: Upsell[] }) {
  const [, forceUpdate] = useState(0);
  const [added, setAdded] = useState<string[]>([]);

  if (upsells.length === 0) return null;

  async function add(u: Upsell) {
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: u.productId, quantity: 1 })
      });
      setAdded((a) => [...a, u.productId]);
      forceUpdate((n) => n + 1);
    } catch { /* keep checkout usable even if this fails */ }
  }

  return (
    <div className="glass p-4">
      <p className="text-sm font-medium mb-3">Add before you go</p>
      <ul className="flex gap-3 overflow-x-auto pb-1">
        {upsells.map((u) => (
          <li key={u.productId} className="shrink-0 w-36">
            <div className="aspect-square rounded-xl overflow-hidden bg-white/5 mb-2">
              {u.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={u.image} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <p className="text-xs truncate">{u.title}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm">${u.price.toFixed(2)}</span>
              <button
                onClick={() => add(u)}
                disabled={added.includes(u.productId)}
                className="glass px-2 py-1 rounded-lg text-xs disabled:opacity-40 hover:bg-white/10"
              >
                {added.includes(u.productId) ? "Added" : "Add"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
