import { describe, expect, it } from "vitest";
import { computeFacets } from "@/lib/search/facets";

const products = [
  { categoryId: "electronics", price: 8, inStock: true },
  { categoryId: "electronics", price: 30, inStock: true },
  { categoryId: "home", price: 120, inStock: false },
  { categoryId: null, price: 15, inStock: true }
];

describe("search facets", () => {
  it("counts category facets, biggest first", () => {
    const f = computeFacets(products);
    expect(f.categories[0]).toEqual({ id: "electronics", count: 2 });
    expect(f.categories.find((c) => c.id === "home")!.count).toBe(1);
  });
  it("bands prices and drops empty bands", () => {
    const f = computeFacets(products);
    const bands = Object.fromEntries(f.priceBands.map((b) => [b.label, b.count]));
    expect(bands["Under $10"]).toBe(1);
    expect(bands["$25 - $50"]).toBe(1);
    expect(bands["$100+"]).toBe(1);
    expect(bands["$10 - $25"]).toBe(1);
    expect(bands["$50 - $100"]).toBeUndefined();
  });
  it("splits availability", () => {
    const f = computeFacets(products);
    expect(f.availability).toEqual({ inStock: 3, outOfStock: 1 });
  });
});
