// Wishlist share links (spec section 6): token-based, revocable.
export type ShareToken = { token: string; wishlistId: string; createdAt: string };

const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

export function generateShareToken(rand = Math.random): string {
  let t = "";
  for (let i = 0; i < 24; i++) t += ALPHABET[Math.floor(rand() * ALPHABET.length)];
  return t;
}

export function isValidShareToken(token: string): boolean {
  return /^[a-z0-9]{24}$/.test(token);
}

// Share URLs never expose user ids - just the opaque token.
export function shareUrl(baseUrl: string, token: string): string {
  return `${baseUrl.replace(/\/+$/, "")}/wishlist/shared/${token}`;
}

// Views are capped per token to keep the owner's email private (anti-scrape).
export function viewLimitReached(views: number, max = 200): boolean {
  return views >= max;
}
