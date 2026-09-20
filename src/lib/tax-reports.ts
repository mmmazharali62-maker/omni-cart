// Tax reporting (spec section 13/17): US states + UK VAT summaries.
export type TaxedOrder = {
  date: string; country: string; state?: string | null;
  taxable: number; taxCollected: number;
};

export function taxByRegion(orders: TaxedOrder[]): Array<{ region: string; orders: number; taxable: number; tax: number }> {
  const byRegion = new Map<string, { orders: number; taxable: number; tax: number }>();
  for (const o of orders) {
    const region = o.country === "GB" ? "UK (VAT)" : `US-${(o.state ?? "??").toUpperCase()}`;
    const agg = byRegion.get(region) ?? { orders: 0, taxable: 0, tax: 0 };
    agg.orders++;
    agg.taxable = Math.round((agg.taxable + o.taxable) * 100) / 100;
    agg.tax = Math.round((agg.tax + o.taxCollected) * 100) / 100;
    byRegion.set(region, agg);
  }
  return [...byRegion.entries()].sort((a, b) => b[1].tax - a[1].tax).map(([region, v]) => ({ region, ...v }));
}

// UK HMRC VAT return boxes (simplified).
export function vatReturnSummary(orders: TaxedOrder[]): { totalExVat: number; outputVat: number } {
  const gb = orders.filter((o) => o.country === "GB");
  return {
    totalExVat: Math.round(gb.reduce((s, o) => s + o.taxable, 0) * 100) / 100,
    outputVat: Math.round(gb.reduce((s, o) => s + o.taxCollected, 0) * 100) / 100
  };
}

// Filing threshold nudge: HMRC requires registration above £90k (2026).
export const UK_VAT_THRESHOLD = 90_000;
export function approachingVatThreshold(rolling12mGbp: number): boolean {
  return rolling12mGbp > UK_VAT_THRESHOLD * 0.85;
}
