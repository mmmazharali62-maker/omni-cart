// Gift card codes + redemption math (spec section 15/16).
export type GiftCard = {
  code: string; initialCents: number; remainingCents: number;
  isActive: boolean; expiresAt: Date | null;
};

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I,0,1,O - readable codes

export function generateGiftCardCode(rand = Math.random): string {
  let body = "";
  for (let i = 0; i < 12; i++) body += ALPHABET[Math.floor(rand() * ALPHABET.length)];
  return `OMNI-${body.slice(0, 4)}-${body.slice(4, 8)}-${body.slice(8, 12)}`;
}

export function isValidGiftCardCode(code: string): boolean {
  return /^OMNI-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code.toUpperCase());
}

export function normalizeCode(code: string): string {
  return code.trim().toUpperCase().replace(/\s+/g, "");
}

// Redemption never over-drafts: min(balance, charge).
export function redemptionPlan(card: GiftCard, chargeCents: number, now = new Date()): { giftCardCents: number; remainderCents: number } | { error: string } {
  if (!card.isActive) return { error: "This gift card is no longer active." };
  if (card.expiresAt && card.expiresAt < now) return { error: "This gift card has expired." };
  if (card.remainingCents <= 0) return { error: "This gift card has no balance left." };
  const giftCardCents = Math.min(card.remainingCents, Math.max(0, chargeCents));
  return { giftCardCents, remainderCents: chargeCents - giftCardCents };
}

export function formatBalance(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat(currency === "GBP" ? "en-GB" : "en-US", { style: "currency", currency }).format(cents / 100);
}
