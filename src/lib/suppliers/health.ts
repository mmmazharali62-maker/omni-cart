// Supplier reliability scoring (spec section 11/14): 0-100 health score.
export type SupplierStats = {
  onTimeRate: number;       // 0-1, shipped within promised window
  fulfillmentRate: number;  // 0-1, orders accepted vs rejected
  defectRate: number;       // 0-1, returns/quality complaints
  avgShipDays: number;      // days from order to ship
  stockSyncAgeHours: number // hours since last successful sync
};

export function supplierHealth(s: SupplierStats): number {
  const onTime = Math.round(s.onTimeRate * 40);
  const fulfillment = Math.round(s.fulfillmentRate * 25);
  const defects = Math.round((1 - s.defectRate) * 20);
  const speed = s.avgShipDays <= 2 ? 10 : s.avgShipDays <= 4 ? 7 : s.avgShipDays <= 7 ? 4 : 0;
  const freshness = s.stockSyncAgeHours <= 24 ? 5 : s.stockSyncAgeHours <= 72 ? 3 : 0;
  return Math.min(100, Math.max(0, onTime + fulfillment + defects + speed + freshness));
}

export function healthVerdict(score: number): "healthy" | "watch" | "risk" {
  if (score >= 80) return "healthy";
  if (score >= 60) return "watch";
  return "risk";
}

// Auto-rotation rule: stop auto-routing orders when health is "risk".
export function shouldAutoRoute(score: number): boolean {
  return healthVerdict(score) !== "risk";
}
