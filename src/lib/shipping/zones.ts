// US/UK shipping zones (spec section 12/19): rate + window by zone.
export type Zone = "us-lower" | "us-ak-hi" | "uk-mainland" | "uk-highlands";

export function zoneFor(country: string, postalCode: string): Zone {
  if (country === "GB") {
    // Simplified: highlands & islands postcodes cost more.
    return /^(IV|HS|KW|ZE|PH\d{0,2}\s?[3-9]|PA\d{0,2}\s?[2-9])/.test(postalCode.toUpperCase().replace(/\s/g, ""))
      ? "uk-highlands"
      : "uk-mainland";
  }
  const pc = postalCode.trim().toUpperCase();
    return /^99[5-9]/.test(pc) || /^96[7-9]/.test(pc) ? "us-ak-hi" : "us-lower";
}

export const ZONE_RATES: Record<Zone, { standardCents: number; expressCents: number; minDays: number; maxDays: number }> = {
  "us-lower": { standardCents: 599, expressCents: 1499, minDays: 7, maxDays: 14 },
  "us-ak-hi": { standardCents: 1499, expressCents: 2999, minDays: 10, maxDays: 21 },
  "uk-mainland": { standardCents: 499, expressCents: 1299, minDays: 7, maxDays: 14 },
  "uk-highlands": { standardCents: 899, expressCents: 1999, minDays: 9, maxDays: 18 }
};

export function rateFor(zone: Zone, method: "standard" | "express"): number {
  return method === "express" ? ZONE_RATES[zone].expressCents : ZONE_RATES[zone].standardCents;
}
