// Carrier metadata + tracking URL builders (spec section 12/19).
export type Carrier = "usps" | "ups" | "fedex" | "royal-mail" | "dhl" | "other";

export const CARRIERS: Record<Carrier, { label: string; trackingUrl: string; region: "US" | "UK" | "global" }> = {
  usps: { label: "USPS", trackingUrl: "https://tools.usps.com/go/TrackConfirmAction?tLabels={n}", region: "US" },
  ups: { label: "UPS", trackingUrl: "https://www.ups.com/track?tracknum={n}", region: "global" },
  fedex: { label: "FedEx", trackingUrl: "https://www.fedex.com/fedextrack/?trknbr={n}", region: "global" },
  "royal-mail": { label: "Royal Mail", trackingUrl: "https://www.royalmail.com/track-your-item/{n}", region: "UK" },
  dhl: { label: "DHL", trackingUrl: "https://www.dhl.com/track?tracking-id={n}", region: "global" },
  other: { label: "Carrier", trackingUrl: "#", region: "global" }
};

export function trackingUrl(carrier: string, trackingNumber: string): string {
  const meta = CARRIERS[(carrier as Carrier)] ?? CARRIERS.other;
  return meta.trackingUrl.replace("{n}", encodeURIComponent(trackingNumber));
}

// Detect a carrier from a tracking number's shape (best effort).
export function detectCarrier(trackingNumber: string): Carrier {
  const n = trackingNumber.toUpperCase().replace(/\s/g, "");
  if (/^(1Z[0-9A-Z]{16}|9\d{15})$/.test(n)) return "ups";
  if (/^\d{12,15}$/.test(n) && !n.startsWith("94")) return "fedex";
  if (n.startsWith("94") || n.startsWith("92") || n.startsWith("93")) return "usps";
  if (/^[A-Z]{2}\d{9}GB$/.test(n)) return "royal-mail";
  if (/^(JD|JJD|GM|LX)\d{8,}/.test(n)) return "dhl";
  return "other";
}
