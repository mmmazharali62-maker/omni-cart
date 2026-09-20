import { activePromos } from "@/lib/promo-calendar";

// Market-aware promo banner (spec section 2/15).
export function PromoBanner({ market = "US", now }: { market?: "US" | "GB"; now?: Date }) {
  const promos = activePromos(now ?? new Date(), market);
  if (promos.length === 0) return null;
  const promo = promos[0];

  return (
    <div className="glass mx-4 mt-4 px-4 py-2 rounded-xl flex items-center justify-between text-sm">
      <span className="font-medium">{promo.name}: {promo.discountPct}% off</span>
      <span className="text-xs text-white/50">Limited window - today only</span>
    </div>
  );
}
