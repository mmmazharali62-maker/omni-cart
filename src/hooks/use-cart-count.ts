"use client";

import { useEffect, useState } from "react";

// Live cart item count (spec section 4) - reads the guest cart API.
export function useCartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    fetch("/api/cart")
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((d) => { if (mounted) setCount(d.items?.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0) ?? 0); })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  return count;
}
