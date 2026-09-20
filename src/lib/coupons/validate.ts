// Coupon validation (spec section 19).
import { db } from "@/lib/db";

export async function validateCoupon(code: string, subtotal: number) {
  const coupon = await db.coupon.findUnique({ where: { code: code.toUpperCase() } });
  if (!coupon || !coupon.isActive) return { ok: false as const, reason: "invalid_code" };
  if (coupon.startsAt && coupon.startsAt > new Date()) return { ok: false as const, reason: "not_started" };
  if (coupon.endsAt && coupon.endsAt < new Date()) return { ok: false as const, reason: "expired" };
  if (coupon.usageLimit != null && coupon.timesUsed >= coupon.usageLimit) {
    return { ok: false as const, reason: "usage_limit_reached" };
  }
  const min = coupon.minOrderAmount ? Number(coupon.minOrderAmount) : null;
  if (min != null && subtotal < min) return { ok: false as const, reason: "min_order_not_met" };
  return { ok: true as const, coupon };
}
