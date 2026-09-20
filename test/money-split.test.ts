import { describe, expect, it } from "vitest";
import { refundAllocation, splitPayment } from "@/lib/money-split";

describe("payment splitting", () => {
  it("splits a partial gift card order", () => {
    expect(splitPayment({ totalCents: 5000, giftCardCents: 2000 })).toEqual({
      giftCardCents: 2000, chargedCents: 3000, fullyCoveredByGiftCard: false
    });
  });
  it("covers a fully-paid order without a card charge", () => {
    expect(splitPayment({ totalCents: 3000, giftCardCents: 9000 })).toEqual({
      giftCardCents: 3000, chargedCents: 0, fullyCoveredByGiftCard: true
    });
  });
  it("handles a zero gift card", () => {
    expect(splitPayment({ totalCents: 1000, giftCardCents: 0 }).chargedCents).toBe(1000);
  });
  it("refunds restore the gift card first", () => {
    expect(refundAllocation(3000, 2000, 2500)).toEqual({ toGiftCardCents: 2000, toCardCents: 500 });
    expect(refundAllocation(3000, 2000, 1000)).toEqual({ toGiftCardCents: 1000, toCardCents: 0 });
  });
  it("never refunds more than was paid", () => {
    expect(refundAllocation(3000, 2000, 9999)).toEqual({ toGiftCardCents: 2000, toCardCents: 3000 });
  });
});
