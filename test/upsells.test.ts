import { describe, expect, it } from "vitest";
import { selectUpsells, type UpsellCandidate } from "@/lib/upsells";

const mk = (over: Partial<UpsellCandidate>): UpsellCandidate => ({
  productId: "p", title: "T", price: 10, cost: 4, categorySlug: "electronics", stock: 10, rating: 4, ...over
});

describe("upsell selection", () => {
  it("prefers same-category, in-stock, cheap items", () => {
    const picks = selectUpsells(["electronics"], ["in-cart"], [
      mk({ productId: "a", categorySlug: "electronics", price: 9.99 }),
      mk({ productId: "b", categorySlug: "home", price: 35 }),
      mk({ productId: "c", categorySlug: "electronics", stock: 0 })
    ]);
    expect(picks.map((p) => p.productId)).toEqual(["a", "b"]); // same-category first
  });
  it("never suggests what's already in the cart", () => {
    const picks = selectUpsells([], ["a"], [mk({ productId: "a" })]);
    expect(picks).toHaveLength(0);
  });
  it("caps the price at impulse range", () => {
    const picks = selectUpsells([], [], [mk({ productId: "x", price: 120 })]);
    expect(picks).toHaveLength(0);
  });
  it("respects the limit", () => {
    const picks = selectUpsells([], [], Array.from({ length: 10 }, (_, i) => mk({ productId: `p${i}` })), 3);
    expect(picks).toHaveLength(3);
  });
});
