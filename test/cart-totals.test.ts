import { describe, it, expect } from "vitest";
import { computeCartTotals } from "@/lib/cart/totals";

describe("cart totals", () => {
  it("sums line items into subtotal", () => {
    const r = computeCartTotals({ lines: [{ unitPrice: 10, quantity: 2 }, { unitPrice: 5, quantity: 1 }] });
    expect(r.subtotal).toBe(25);
  });

  it("applies percentage coupon", () => {
    const r = computeCartTotals({
      lines: [{ unitPrice: 100, quantity: 1 }],
      coupon: { type: "percentage", value: 10 }
    });
    expect(r.discountTotal).toBe(10);
    expect(r.grandTotal).toBe(90);
  });

  it("grants free shipping past threshold", () => {
    const r = computeCartTotals({ lines: [{ unitPrice: 60, quantity: 1 }] });
    expect(r.shippingTotal).toBe(0);
  });

  it("charges shipping below threshold", () => {
    const r = computeCartTotals({ lines: [{ unitPrice: 20, quantity: 1 }] });
    expect(r.shippingTotal).toBe(5.99);
    expect(r.freeShippingRemaining).toBe(30);
  });

  it("applies tax on discounted amount", () => {
    const r = computeCartTotals({
      lines: [{ unitPrice: 100, quantity: 1 }],
      coupon: { type: "fixed", value: 20 },
      taxRate: 0.1
    });
    expect(r.taxTotal).toBe(8);
    expect(r.grandTotal).toBe(88);
  });
});
