// UK customs/duty estimates (spec section 12): customer-facing transparency.
// Goods under GBP135 are handled by the seller (no import duty); above that,
// the customer pays duty at the border - we warn them at checkout.
export const UK_DEMINIMIS_GBP = 135;

export type DutyEstimate = { dutyCents: number; vatCents: number; paidAtCheckout: boolean; note: string | null };

export function estimateDuties(country: string, subtotalGbp: number, category = "general"): DutyEstimate {
  if (country !== "GB") return { dutyCents: 0, vatCents: 0, paidAtCheckout: true, note: null };

  const handled = subtotalGbp <= UK_DEMINIMIS_GBP;
  const dutyRate: Record<string, number> = { general: 0.06, electronics: 0, clothing: 0.12, home: 0.04 };
  const rate = dutyRate[category] ?? 0.06;
  const duty = handled ? 0 : Math.round(subtotalGbp * 100 * rate);
  return {
    dutyCents: duty,
    vatCents: 0, // VAT charged at checkout in both cases
    paidAtCheckout: handled,
    note: handled ? null : "Orders over £135 ship DDU: UK customs may charge duty on delivery."
  };
}
