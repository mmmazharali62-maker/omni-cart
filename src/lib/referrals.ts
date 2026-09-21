// Referral program (spec section 15): invite code, $5 both sides.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function generateReferralCode(rand = Math.random): string {
  let body = "";
  for (let i = 0; i < 8; i++) body += ALPHABET[Math.floor(rand() * ALPHABET.length)];
  return `REF-${body}`;
}

export function isValidReferralCode(code: string): boolean {
  return /^REF-[A-Z0-9]{8}$/.test(code.toUpperCase());
}

export const REFEREE_MIN_ORDER_CENTS = 1500; // referee must spend $15+
export const REWARD_CENTS = 500; // $5 credit for each side

// Reward unlocks only when the referee's order actually delivers - not at purchase.
export function referralEligible(orderStatus: string, orderTotalCents: number): boolean {
  const delivered = orderStatus === "DELIVERED";
  return delivered && orderTotalCents >= REFEREE_MIN_ORDER_CENTS;
}

// One referral reward per referee email, ever.
export function alreadyReferred(refereeEmail: string, existing: string[]): boolean {
  return existing.map((e) => e.toLowerCase()).includes(refereeEmail.toLowerCase());
}

export function referralShareUrl(baseUrl: string, code: string): string {
  return `${baseUrl.replace(/\/+$/, "")}/?ref=${code}`;
}
