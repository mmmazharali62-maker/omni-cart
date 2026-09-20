import { describe, expect, it } from "vitest";
import { formatBalance, generateGiftCardCode, isValidGiftCardCode, normalizeCode, redemptionPlan } from "@/lib/gift-cards";

describe("gift cards", () => {
  it("generates valid readable codes", () => {
    const code = generateGiftCardCode(() => 0.99);
    expect(code).toMatch(/^OMNI-/);
    expect(isValidGiftCardCode(code)).toBe(true);
  });
  it("codes exclude confusing characters", () => {
    for (let i = 0; i < 30; i++) {
      const body = generateGiftCardCode().slice(5); // ignore the OMNI- prefix
      expect(body).not.toMatch(/[IO01]/);
    }
  });
  it("normalizes messy user input", () => {
    expect(normalizeCode("  omni-abcd-2345-Wxyz ")).toBe("OMNI-ABCD-2345-WXYZ");
  });
  it("redeems up to the balance only", () => {
    const card = { code: "X", initialCents: 5000, remainingCents: 3000, isActive: true, expiresAt: null };
    expect(redemptionPlan(card, 4000)).toEqual({ giftCardCents: 3000, remainderCents: 1000 });
    expect(redemptionPlan(card, 2000)).toEqual({ giftCardCents: 2000, remainderCents: 0 });
  });
  it("refuses inactive or expired cards", () => {
    const inactive = { code: "X", initialCents: 1000, remainingCents: 1000, isActive: false, expiresAt: null };
    const expired = { code: "X", initialCents: 1000, remainingCents: 1000, isActive: true, expiresAt: new Date("2020-01-01") };
    expect("error" in redemptionPlan(inactive, 500)).toBe(true);
    expect("error" in redemptionPlan(expired, 500)).toBe(true);
  });
  it("formats balances per currency", () => {
    expect(formatBalance(2500, "USD")).toBe("$25.00");
    expect(formatBalance(2500, "GBP")).toContain("25.00");
  });
});
