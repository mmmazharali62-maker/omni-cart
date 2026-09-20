"use client";

import { useEffect, useState } from "react";

// Active promo for the market banner (spec section 15).
export function usePromos() {
  const [promo, setPromo] = useState<{ id: string; name: string; discountPct: number } | null>(null);

  useEffect(() => {
    const market = document.cookie.match(/omni-market=(US|GB)/)?.[1] ?? "US";
    import("@/lib/promo-calendar").then(({ activePromos }) => {
      const [p] = activePromos(new Date(), market as "US" | "GB");
      setPromo(p ? { id: p.id, name: p.name, discountPct: p.discountPct } : null);
    });
  }, []);

  return promo;
}
