import { describe, expect, it } from "vitest";
import { chooseSupplier, fallbackChain } from "@/lib/suppliers/routing";

describe("supplier routing", () => {
  it("picks the cheap healthy supplier", () => {
    const pick = chooseSupplier([
      { supplierId: "a", name: "A", healthScore: 95, cost: 12, avgShipDays: 2, inStock: true },
      { supplierId: "b", name: "B", healthScore: 94, cost: 10, avgShipDays: 3, inStock: true }
    ]);
    expect(pick?.supplierId).toBe("b");
  });
  it("health beats price past a 10-point gap", () => {
    const pick = chooseSupplier([
      { supplierId: "a", name: "A", healthScore: 95, cost: 15, avgShipDays: 2, inStock: true },
      { supplierId: "b", name: "B", healthScore: 70, cost: 5, avgShipDays: 3, inStock: true }
    ]);
    expect(pick?.supplierId).toBe("a");
  });
  it("skips out-of-stock and risky suppliers", () => {
    expect(chooseSupplier([
      { supplierId: "a", name: "A", healthScore: 95, cost: 1, avgShipDays: 1, inStock: false },
      { supplierId: "b", name: "B", healthScore: 50, cost: 1, avgShipDays: 1, inStock: true }
    ])).toBeNull();
  });
  it("builds a fallback chain ordered by health", () => {
    const chain = fallbackChain([
      { supplierId: "a", name: "A", healthScore: 60, cost: 1, avgShipDays: 1, inStock: true },
      { supplierId: "b", name: "B", healthScore: 90, cost: 9, avgShipDays: 1, inStock: true },
      { supplierId: "c", name: "C", healthScore: 99, cost: 1, avgShipDays: 1, inStock: false }
    ]);
    expect(chain.map((c) => c.supplierId)).toEqual(["b", "a"]);
  });
});
