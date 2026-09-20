// Conversion funnel analytics (spec section 13/14). Pure functions over event counts.
export type FunnelStage = "viewed_shop" | "viewed_product" | "added_to_cart" | "started_checkout" | "paid";

export type FunnelCounts = Record<FunnelStage, number>;

export function funnelSteps(counts: FunnelCounts): Array<{ stage: FunnelStage; count: number; pct: number; dropOff: number }> {
  const top = counts.viewed_shop || 1;
  return (Object.keys(counts) as FunnelStage[]).map((stage, i, arr) => {
    const prev = i === 0 ? counts[stage] : counts[arr[i - 1]];
    const count = counts[stage];
    return {
      stage,
      count,
      pct: Math.round((count / top) * 1000) / 10,
      dropOff: prev > 0 ? Math.round(((prev - count) / prev) * 1000) / 10 : 0
    };
  });
}

// The stage with the biggest loss - where to focus optimization.
export function biggestDropOff(counts: FunnelCounts): { stage: FunnelStage; dropOff: number } | null {
  const steps = funnelSteps(counts).filter((s) => s.dropOff > 0);
  if (steps.length === 0) return null;
  const worst = steps.reduce((a, b) => (b.dropOff > a.dropOff ? b : a));
  return { stage: worst.stage, dropOff: worst.dropOff };
}
