import { describe, expect, it } from "vitest";
import { bundlePitch, bundlePrice, bundleSavings } from "@/lib/bundles";

const bundle = {
  id: "desk", title: "Desk Setup",
  items: [{ price: 30 }, { price: 20 }, { price: 10 }],
  discountPct: 20
};

describe("bundles", () => {
  it("applies the discount to the combined price", () => {
    expect(bundlePrice(bundle)).toBe(48); // 60 * 0.8
  });
  it("computes savings exactly", () => {
    expect(bundleSavings(bundle)).toBe(12);
  });
  it("handles 0% and 100% discounts", () => {
    expect(bundlePrice({ ...bundle, discountPct: 0 })).toBe(60);
    expect(bundlePrice({ ...bundle, discountPct: 100 })).toBe(0);
  });
  it("clamps wild discounts", () => {
    expect(bundlePrice({ ...bundle, discountPct: 150 })).toBe(0);
  });
  it("pitches savings honestly", () => {
    expect(bundlePitch(12, "USD")).toContain("Save $12.00");
    expect(bundlePitch(0)).toBe("Frequently bought together");
  });
});
