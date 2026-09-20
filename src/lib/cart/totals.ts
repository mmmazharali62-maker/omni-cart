// Server-side cart totals (spec section 4): discount, shipping, tax, grand total.
// All values recomputed from DB prices; never accept client-sent totals.

export type CartTotalsInput = {
  lines: Array<{ unitPrice: number; quantity: number }>;
  coupon?: { type: "percentage" | "fixed" | "free_shipping"; value?: number; minOrderAmount?: number };
  shippingBaseRate?: number;
  freeShippingThreshold?: number;
  taxRate?: number; // e.g. 0.0825
};

export type CartTotalsResult = {
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  taxTotal: number;
  grandTotal: number;
  freeShippingRemaining: number;
};

export function computeCartTotals(input: CartTotalsInput): CartTotalsResult {
  const subtotal = input.lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const shippingBaseRate = input.shippingBaseRate ?? 5.99;
  const freeShippingThreshold = input.freeShippingThreshold ?? 50;
  const taxRate = input.taxRate ?? 0;

  let discountTotal = 0;
  let freeShipping = false;
  const coupon = input.coupon;
  if (coupon && (coupon.minOrderAmount == null || subtotal >= coupon.minOrderAmount)) {
    if (coupon.type === "percentage" && coupon.value) {
      discountTotal = subtotal * (coupon.value / 100);
    } else if (coupon.type === "fixed" && coupon.value) {
      discountTotal = Math.min(coupon.value, subtotal);
    } else if (coupon.type === "free_shipping") {
      freeShipping = true;
    }
  }

  const afterDiscount = subtotal - discountTotal;
  const shippingTotal = subtotal >= freeShippingThreshold || freeShipping ? 0 : shippingBaseRate;
  const taxTotal = afterDiscount * taxRate;
  const grandTotal = afterDiscount + shippingTotal + taxTotal;

  const round = (n: number) => Math.round(n * 100) / 100;
  return {
    subtotal: round(subtotal),
    discountTotal: round(discountTotal),
    shippingTotal: round(shippingTotal),
    taxTotal: round(taxTotal),
    grandTotal: round(grandTotal),
    freeShippingRemaining: round(Math.max(0, freeShippingThreshold - subtotal))
  };
}
