import { describe, expect, it } from "vitest";
import { averageOrderValue, conversionRate, percentChange } from "@/lib/metrics";

describe("metrics", () => {
  it("conversionRate handles zero sessions and rounds to 2dp", () => {
    expect(conversionRate(5, 0)).toBe(0);
    expect(conversionRate(3, 90)).toBe(3.33);
  });
  it("averageOrderValue handles zero orders", () => {
    expect(averageOrderValue(100, 0)).toBe(0);
    expect(averageOrderValue(100, 4)).toBe(25);
  });
  it("percentChange handles zero baseline and signs", () => {
    expect(percentChange(10, 0)).toBe(100);
    expect(percentChange(120, 100)).toBe(20);
    expect(percentChange(80, 100)).toBe(-20);
  });
});
