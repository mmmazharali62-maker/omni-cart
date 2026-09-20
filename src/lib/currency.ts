// Currency formatting + conversion (spec section 1/13). USD and GBP only.
export type Currency = "USD" | "GBP";

// Indicative fixed rate; the pricing engine stores per-product dual pricing,
// so this is only a display fallback for unsynced items.
const USD_TO_GBP = 0.79;

export function formatMoney(amount: number, currency: Currency = "USD"): string {
  return new Intl.NumberFormat(currency === "GBP" ? "en-GB" : "en-US", {
    style: "currency",
    currency
  }).format(amount);
}

export function convert(amount: number, from: Currency, to: Currency): number {
  if (from === to) return Math.round(amount * 100) / 100;
  const usd = from === "USD" ? amount : amount / USD_TO_GBP;
  return Math.round((to === "USD" ? usd : usd * USD_TO_GBP) * 100) / 100;
}

// Safe money math: always work in integer cents.
export function toCents(amount: number): number {
  return Math.round(amount * 100);
}
export function fromCents(cents: number): number {
  return Math.round(cents) / 100;
}
