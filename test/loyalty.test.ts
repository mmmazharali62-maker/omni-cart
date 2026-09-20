import { describe, expect, it } from "vitest";
import { pointsForOrder, pointsToNextTier, tierForLifetimePoints, TIER_PERKS } from "@/lib/loyalty";

describe("loyalty", () => {
  it("awards 1 point per whole $1", () => {
    expect(pointsForOrder(49.99)).toBe(49);
    expect(pointsForOrder(-5)).toBe(0);
  });
  it("maps points to tiers", () => {
    expect(tierForLifetimePoints(0)).toBe("bronze");
    expect(tierForLifetimePoints(300)).toBe("silver");
    expect(tierForLifetimePoints(1500)).toBe("gold");
    expect(tierForLifetimePoints(3000)).toBe("platinum");
  });
  it("computes points to the next tier", () => {
    expect(pointsToNextTier(0)).toEqual({ tier: "silver", needed: 250 });
    expect(pointsToNextTier(999)).toEqual({ tier: "gold", needed: 1 });
    expect(pointsToNextTier(9999)).toBeNull();
  });
  it("every tier has perks", () => {
    for (const perks of Object.values(TIER_PERKS)) {
      expect(perks.length).toBeGreaterThan(0);
    }
  });
});
