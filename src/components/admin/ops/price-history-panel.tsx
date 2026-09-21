import { GlassPanel } from "@/components/ui/glass-panel";
import { PriceHistoryChart } from "@/components/product/price-history-chart";
import { priceDrop } from "@/lib/price-history";

export type ProductHistory = {
  id: string; title: string; currentPrice: number;
  snapshots: Array<{ price: number; capturedAt: string }>;
};

// Price history watchlist (spec section 10/12/26): spot drift + drops.
export function PriceHistoryPanel({ products }: { products: ProductHistory[] }) {
  if (products.length === 0) {
    return <p className="text-sm text-white/50">No price history yet - snapshots accumulate with each sync.</p>;
  }
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {products.map((p) => {
        const drop = priceDrop(p.snapshots.map((s) => ({ ...s, capturedAt: new Date(s.capturedAt) })));
        return (
          <GlassPanel key={p.id} className="p-5">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium text-sm truncate">{p.title}</p>
              <p className="text-lg font-semibold shrink-0">${p.currentPrice.toFixed(2)}</p>
            </div>
            {drop ? (
              <p className="text-xs text-emerald-400 mt-1">
                Down {drop.dropPct}% from ${drop.from.toFixed(2)} - consider matching.
              </p>
            ) : (
              <p className="text-xs text-white/40 mt-1">No significant drop in 30 days.</p>
            )}
            <div className="mt-3">
              <PriceHistoryChart points={p.snapshots.map((s) => ({ ...s, capturedAt: new Date(s.capturedAt) }))} width={260} height={56} />
            </div>
          </GlassPanel>
        );
      })}
    </div>
  );
}
