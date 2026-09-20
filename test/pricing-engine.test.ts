import { describe, it, expect } from "vitest";
import { calculateSellingPrice } from "@/lib/pricing-engine";

describe("pricing engine", () => {
  it("applies percentage markup", () => {
    expect(calculateSellingPrice(10, { type: "percentage_markup", value: 50 })).toBe(15);
  });

  it("respects minimum profit", () => {
    expect(calculateSellingPrice(10, { type: "percentage_markup", value: 5, minProfit: 8 })).toBe(18);
  });

  it("caps at maxPrice", () => {
    expect(calculateSellingPrice(10, { type: "percentage_markup", value: 500, maxPrice: 30 })).toBe(30);
  });
});
