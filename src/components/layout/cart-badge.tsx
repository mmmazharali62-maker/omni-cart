"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Live cart count badge; refreshes on route change.
export function CartBadge() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/cart")
      .then((r) => r.json())
      .then((d) => setCount(d.items?.length ?? 0))
      .catch(() => setCount(0));
  }, []);

  return (
    <Link href="/cart" className="glass px-3 py-2 rounded-lg text-sm relative">
      Cart
      {count != null && count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  );
}
