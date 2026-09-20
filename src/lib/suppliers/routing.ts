// Supplier routing (spec section 11/19): pick the best source per product.
import { shouldAutoRoute } from "./health";
import type { SupplierStats } from "./health";

export type RoutingCandidate = {
  supplierId: string; name: string; healthScore: number;
  cost: number; avgShipDays: number; inStock: boolean;
};

// Order of preference: in-stock, healthy, cheapest, fastest.
export function chooseSupplier(candidates: RoutingCandidate[]): RoutingCandidate | null {
  const viable = candidates
    .filter((c) => c.inStock && shouldAutoRoute(c.healthScore))
    .sort((a, b) => {
      // A 10+ health point advantage beats a small price difference.
      if (Math.abs(a.healthScore - b.healthScore) >= 10) return b.healthScore - a.healthScore;
      if (a.cost !== b.cost) return a.cost - b.cost;
      return a.avgShipDays - b.avgShipDays;
    });
  return viable[0] ?? null;
}

// Fallback chain if the primary supplier goes out of stock mid-fulfilment.
export function fallbackChain(candidates: RoutingCandidate[]): RoutingCandidate[] {
  return [...candidates]
    .filter((c) => c.inStock)
    .sort((a, b) => b.healthScore - a.healthScore || a.cost - b.cost);
}

export function statsToScore(s: SupplierStats, supplierHealth: (stats: SupplierStats) => number): number {
  return supplierHealth(s);
}
