import { describe, expect, it } from "vitest";
import { canStack, pickStackable, STACKING_COPY, type CouponLike } from "@/lib/coupons/stacking";

describe("coupon stacking", () => {
  const pct: CouponLike = { code: "SAVE10", type: "percentage", value: 10 };
  const fixed: CouponLike = { code: "FIVE", type: "fixed", value: 5 };
  const ship: CouponLike = { code: "FREESHIP", type: "free_shipping" };

  it("picks one discount + one shipping coupon", () => {
    const picked = pickStackable([pct, fixed, ship]);
    expect(picked.discount?.code).toBe("SAVE10");
    expect(picked.shipping?.code).toBe("FREESHIP");
  });
  it("blocks two discount coupons", () => {
    expect(canStack([pct], fixed)).toBe(false);
    expect(canStack([pct], ship)).toBe(true);
    expect(canStack([ship], ship)).toBe(false);
  });
  it("explains the rule to customers", () => {
    expect(STACKING_COPY).toContain("One discount code");
  });
});
