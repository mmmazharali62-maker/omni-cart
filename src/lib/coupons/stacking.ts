// Coupon stacking rules (spec section 15/19): at most one per type.
export type CouponLike = { code: string; type: "percentage" | "fixed" | "free_shipping"; value?: number };

// Only ONE discount coupon + ONE free-shipping coupon may combine.
export function pickStackable(coupons: CouponLike[]): { discount?: CouponLike; shipping?: CouponLike } {
  const discount = coupons.find((c) => c.type !== "free_shipping");
  const shipping = coupons.find((c) => c.type === "free_shipping");
  return { discount, shipping };
}

// Can this coupon be added given what's already applied?
export function canStack(existing: CouponLike[], candidate: CouponLike): boolean {
  const sameType = existing.some((c) =>
    candidate.type === "free_shipping" ? c.type === "free_shipping" : c.type !== "free_shipping"
  );
  return !sameType;
}

export const STACKING_COPY = "One discount code and one free-shipping code can be combined.";
