// Return eligibility rules (spec section 29): 30-day window, category exclusions.
import { STORE } from "@/lib/config";

export const NON_RETURNABLE_CATEGORIES = ["personal-care", "intimates", "digital-gift-cards", "custom-made"];

export type EligibilityResult = { eligible: boolean; reason?: string; deadline: Date | null };

export function returnEligibility(
  orderDeliveredAt: Date | null,
  categorySlug: string,
  now = new Date()
): EligibilityResult {
  if (!orderDeliveredAt) {
    return { eligible: false, reason: "Order hasn't been delivered yet", deadline: null };
  }
  if (NON_RETURNABLE_CATEGORIES.includes(categorySlug)) {
    return { eligible: false, reason: "This item category is final-sale", deadline: null };
  }
  const deadline = new Date(orderDeliveredAt);
  deadline.setDate(deadline.getDate() + STORE.returnWindowDays);
  if (now > deadline) {
    return { eligible: false, reason: `Return window closed on ${deadline.toLocaleDateString()}`, deadline };
  }
  return { eligible: true, deadline };
}

export function refundDue(paidCents: number, daysSinceDelivery: number): number {
  if (daysSinceDelivery <= 14) return paidCents; // full refund
  if (daysSinceDelivery <= 30) return Math.round(paidCents * 0.85); // 15% restocking
  return 0;
}
