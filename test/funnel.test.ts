import { describe, expect, it } from "vitest";
import { biggestDropOff, funnelSteps } from "@/lib/funnel";

const counts = { viewed_shop: 1000, viewed_product: 400, added_to_cart: 200, started_checkout: 120, paid: 80 };

describe("conversion funnel", () => {
  it("computes step percentages from the top", () => {
    const steps = funnelSteps(counts);
    expect(steps[0].pct).toBe(100);
    expect(steps[4].pct).toBe(8);
  });
  it("computes drop-off per step", () => {
    const steps = funnelSteps(counts);
    expect(steps[1].dropOff).toBe(60); // 1000 -> 400
    expect(steps[4].dropOff).toBe(33.3); // 120 -> 80
  });
  it("finds the biggest leak", () => {
    expect(biggestDropOff(counts)).toEqual({ stage: "viewed_product", dropOff: 60 });
  });
  it("handles a perfect funnel", () => {
    const perfect = { viewed_shop: 10, viewed_product: 10, added_to_cart: 10, started_checkout: 10, paid: 10 };
    expect(biggestDropOff(perfect)).toBeNull();
  });
  it("handles zero traffic without dividing by zero", () => {
    const empty = { viewed_shop: 0, viewed_product: 0, added_to_cart: 0, started_checkout: 0, paid: 0 };
    expect(() => funnelSteps(empty)).not.toThrow();
  });
});
