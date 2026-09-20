import { describe, expect, it } from "vitest";
import { fraudCheck } from "@/lib/fraud/checks";

const normal = { itemsCount: 2, totalCents: 4500, hoursSinceSignup: 400, distinctCountriesInDay: 1, isGuest: false, quantityPerItem: 1 };

describe("fraud heuristics", () => {
  it("allows normal orders", () => {
    const v = fraudCheck(normal);
    expect(v.action).toBe("allow");
    expect(v.score).toBeLessThan(30);
  });
  it("flags high-value bulk guest orders for review", () => {
    const v = fraudCheck({ ...normal, totalCents: 80_000, isGuest: true, quantityPerItem: 12 });
    expect(v.action).not.toBe("allow");
    expect(v.flags).toContain("high-value order");
  });
  it("holds brand-new accounts spending big", () => {
    const v = fraudCheck({ ...normal, totalCents: 60_000, hoursSinceSignup: 0.5 });
    expect(v.action).toBe("hold");
  });
  it("flags multi-country activity", () => {
    const v = fraudCheck({ ...normal, distinctCountriesInDay: 4 });
    expect(v.flags).toContain("multi-country activity");
  });
  it("never exceeds score bounds", () => {
    const v = fraudCheck({ itemsCount: 99, totalCents: 99_999, hoursSinceSignup: 0, distinctCountriesInDay: 9, isGuest: true, quantityPerItem: 99 });
    expect(v.score).toBeLessThanOrEqual(100);
  });
});
