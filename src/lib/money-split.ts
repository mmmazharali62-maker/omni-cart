// Payment split math (spec section 16): gift card + card on one order.
export type SplitInput = { totalCents: number; giftCardCents: number };

export type SplitResult = { giftCardCents: number; chargedCents: number; fullyCoveredByGiftCard: boolean };

export function splitPayment({ totalCents, giftCardCents }: SplitInput): SplitResult {
  const gift = Math.min(Math.max(0, giftCardCents), totalCents);
  return {
    giftCardCents: gift,
    chargedCents: totalCents - gift,
    fullyCoveredByGiftCard: gift === totalCents
  };
}

// Refunds return gift-card money to the gift card first, the rest to the card.
export function refundAllocation(chargeCents: number, giftCardCents: number, refundCents: number) {
  const refund = Math.min(refundCents, chargeCents + giftCardCents);
  const toGiftCard = Math.min(giftCardCents, refund);
  return { toGiftCardCents: toGiftCard, toCardCents: refund - toGiftCard };
}
