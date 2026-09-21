// Price history + drop detection (spec section 10/12).
export type Snapshot = { price: number; capturedAt: string | Date };

// A drop is "significant" at 5%+ or $2+, and only vs the 30-day high.
export function priceDrop(snapshots: Snapshot[], now = new Date(), windowDays = 30): { dropPct: number; from: number; to: number } | null {
  const cutoff = new Date(now.getTime() - windowDays * 86_400_000);
  const recent = snapshots.filter((s) => new Date(s.capturedAt) >= cutoff);
  if (recent.length < 2) return null;

  const prices = recent.map((s) => s.price);
  const from = Math.max(...prices);
  const to = recent[recent.length - 1].price;
  if (from <= 0 || to >= from) return null;

  const dropPct = Math.round(((from - to) / from) * 1000) / 10;
  const dropAbs = from - to;
  if (dropPct < 5 && dropAbs < 2) return null;
  return { dropPct, from, to };
}

// Was it cheaper in the last 90 days? Honest answer for price-history claims.
export function lowestInWindow(snapshots: Snapshot[], windowDays = 90): number | null {
  const cutoff = Date.now() - windowDays * 86_400_000;
  const prices = snapshots.filter((s) => new Date(s.capturedAt).getTime() >= cutoff).map((s) => s.price);
  return prices.length ? Math.min(...prices) : null;
}
