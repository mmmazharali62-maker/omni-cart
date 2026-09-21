import { describe, expect, it } from "vitest";
import { lowestInWindow, priceDrop } from "@/lib/price-history";

const day = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();

describe("price history", () => {
  it("detects a real drop vs the 30-day high", () => {
    const drop = priceDrop([
      { price: 29.99, capturedAt: day(20) },
      { price: 24.99, capturedAt: day(1) }
    ]);
    expect(drop).toEqual({ dropPct: 16.7, from: 29.99, to: 24.99 });
  });
  it("ignores noise under 5% and $2", () => {
    expect(priceDrop([
      { price: 20, capturedAt: day(10) },
      { price: 19.5, capturedAt: day(1) }
    ])).toBeNull();
  });
  it("ignores rises and stale data", () => {
    expect(priceDrop([{ price: 10, capturedAt: day(1) }, { price: 15, capturedAt: day(0) }])).toBeNull();
    expect(priceDrop([{ price: 50, capturedAt: day(90) }, { price: 10, capturedAt: day(89) }])).toBeNull();
  });
  it("finds the 90-day low", () => {
    expect(lowestInWindow([{ price: 15, capturedAt: day(5) }, { price: 9.99, capturedAt: day(30) }])).toBe(9.99);
    expect(lowestInWindow([{ price: 9.99, capturedAt: day(200) }])).toBeNull();
  });
});
