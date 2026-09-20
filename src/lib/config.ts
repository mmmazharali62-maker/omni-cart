// Store-level configuration (spec section 1). Market-driven, US + UK.
export const STORE = {
  name: "Omni Cart",
  supportEmail: "support@omnicart.example.com",
  markets: ["US", "GB"] as const,
  defaultCurrency: "USD",
  freeShippingThreshold: { USD: 50, GBP: 40 },
  currencies: { US: "USD", GB: "GBP" },
  locales: { US: "en-US", GB: "en-GB" },
  returnWindowDays: 30
} as const;

export type Market = (typeof STORE.markets)[number];
export type Currency = "USD" | "GBP";

export function marketFromCountry(country: string): Market {
  return country === "GB" ? "GB" : "US";
}

export function currencyFor(country: string): Currency {
  return STORE.currencies[marketFromCountry(country) as Market] ?? "USD";
}

export function freeShippingThreshold(currency: Currency): number {
  return STORE.freeShippingThreshold[currency];
}
