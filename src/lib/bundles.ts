// Product bundles (spec section 15): buy-together pricing.
export type BundleInput = {
  id: string; title: string;
  items: Array<{ price: number }>;
  discountPct: number; // 0-100 off the combined price
};

export function bundlePrice(bundle: BundleInput): number {
  const combined = bundle.items.reduce((s, i) => s + i.price, 0);
  const withDiscount = combined * (1 - Math.min(100, Math.max(0, bundle.discountPct)) / 100);
  return Math.round(withDiscount * 100) / 100;
}

export function bundleSavings(bundle: BundleInput): number {
  const combined = bundle.items.reduce((s, i) => s + i.price, 0);
  return Math.round((combined - bundlePrice(bundle)) * 100) / 100;
}

// Only surface bundles where every item is in stock.
export function availableBundle(bundle: BundleInput, stocks: Record<string, number>): boolean {
  return bundle.items.every((item, i) => (stocks[`${bundle.id}:${i}`] ?? stocks[bundle.id] ?? 1) > 0);
}

// Conversion copy: honest framing beats fake urgency.
export function bundlePitch(savings: number, currency = "USD"): string {
  if (savings <= 0) return "Frequently bought together";
  const money = new Intl.NumberFormat(currency === "GBP" ? "en-GB" : "en-US", { style: "currency", currency }).format(savings);
  return `Save ${money} when you buy together`;
}
