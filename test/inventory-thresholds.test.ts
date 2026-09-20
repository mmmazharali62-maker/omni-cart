import { describe, expect, it } from "vitest";
import { dynamicThreshold, shouldRestock, stockLevel } from "@/lib/inventory/thresholds";

describe("inventory thresholds", () => {
  it("classifies stock levels", () => {
    expect(stockLevel(0)).toBe("out");
    expect(stockLevel(2)).toBe("critical");
    expect(stockLevel(8)).toBe("low");
    expect(stockLevel(50)).toBe("healthy");
  });
  it("respects custom thresholds", () => {
    expect(stockLevel(15, 20, 10)).toBe("low");
  });
  it("demands restock when coverage is thin", () => {
    expect(shouldRestock(4, 0, 20)).toBe(true); // out soon, nothing incoming
    expect(shouldRestock(100, 0, 10)).toBe(false);
    expect(shouldRestock(0, 100, 10)).toBe(true); // out of stock always restocks
  });
  it("scales the threshold with sales velocity", () => {
    expect(dynamicThreshold(2)).toBe(5); // floor of 5
    expect(dynamicThreshold(20)).toBe(30);
  });
});
