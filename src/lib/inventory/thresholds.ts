// Low-stock thresholds (spec section 11/14): alerts feed the sync jobs.
export type StockLevel = "out" | "critical" | "low" | "healthy";

export function stockLevel(stock: number, lowAt = 10, criticalAt = 3): StockLevel {
  if (stock <= 0) return "out";
  if (stock <= criticalAt) return "critical";
  if (stock <= lowAt) return "low";
  return "healthy";
}

export function shouldRestock(stock: number, incomingPerWeek: number, salesPerWeek: number): boolean {
  if (stock <= 0) return true;
  const weeksOfStock = salesPerWeek > 0 ? stock / salesPerWeek : Infinity;
  return weeksOfStock < 2 && stock + incomingPerWeek < salesPerWeek * 4;
}

// Dynamic low-threshold: 1.5x average weekly sales, min 5.
export function dynamicThreshold(salesPerWeek: number): number {
  return Math.max(5, Math.ceil(salesPerWeek * 1.5));
}
