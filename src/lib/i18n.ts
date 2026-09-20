// Locale copy for the two storefront markets (spec section 2).
// en-GB uses British spellings; en-US keeps US conventions.
const STRINGS = {
  "en-GB": { cart: "basket", checkout: "checkout", color: "colour", favorites: "favourites", freeShipping: "free delivery", returns: "returns" },
  "en-US": { cart: "cart", checkout: "checkout", color: "color", favorites: "favorites", freeShipping: "free shipping", returns: "returns" }
} as const;

export type Locale = keyof typeof STRINGS;
export type StringKey = keyof (typeof STRINGS)["en-US"];

export function stringsFor(locale: Locale) {
  return STRINGS[locale] ?? STRINGS["en-US"];
}

export function t(locale: Locale, key: StringKey): string {
  return stringsFor(locale)[key];
}

export function localeForCountry(country: string): Locale {
  return country === "GB" ? "en-GB" : "en-US";
}
