"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartCount } from "@/hooks/use-cart-count";

// Compact cart widget for the header: count + quick peek (spec section 2/4).
export function MiniCart() {
  const count = useCartCount();
  const [items, setItems] = useState<Array<{ title: string; quantity: number; price: number }>>([]);

  useEffect(() => {
    if (count === 0) { setItems([]); return; }
    fetch("/api/cart")
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((d) => setItems(d.items?.slice(0, 3) ?? []))
      .catch(() => {});
  }, [count]);

  return (
    <div className="relative group">
      <Link href="/cart" className="glass px-3 py-2 rounded-lg text-sm flex items-center gap-2" aria-label={`Cart, ${count} items`}>
        <span aria-hidden="true">🛒</span>
        <span className="font-medium">{count > 0 ? count : ""}</span>
      </Link>
      {items.length > 0 && (
        <div className="absolute right-0 top-full mt-2 w-64 glass rounded-xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition z-30">
          <ul className="text-sm space-y-2">
            {items.map((i, idx) => (
              <li key={idx} className="flex justify-between gap-2">
                <span className="truncate">{i.quantity}x {i.title}</span>
                <span>${(i.price * i.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <Link href="/cart" className="block text-center mt-3 bg-brand-600 rounded-lg py-1.5 text-xs font-medium">
            View cart
          </Link>
        </div>
      )}
    </div>
  );
}
