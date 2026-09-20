// Delivery estimates for US/UK (spec section 12/19): fed to PDP + checkout.
export type ShippingOption = {
  id: "standard" | "express";
  label: string;
  minDays: number;
  maxDays: number;
  priceCents: Record<"USD" | "GBP", number>;
};

export const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: "standard", label: "Standard", minDays: 7, maxDays: 14, priceCents: { USD: 599, GBP: 499 } },
  { id: "express", label: "Express", minDays: 3, maxDays: 7, priceCents: { USD: 1499, GBP: 1299 } }
];

export function optionPrice(option: ShippingOption, currency: "USD" | "GBP"): number {
  return option.priceCents[currency];
}

export function formatWindow(option: ShippingOption): string {
  return `${option.minDays}-${option.maxDays} business days`;
}

// Supplier processing adds days for dropshipped goods: pass supplier lead time.
export function estimatedDelivery(optionId: "standard" | "express", supplierLeadDays = 2, from = new Date()): { from: Date; to: Date } {
  const option = SHIPPING_OPTIONS.find((o) => o.id === optionId) ?? SHIPPING_OPTIONS[0];
  const addBusinessDays = (days: number) => {
    const d = new Date(from);
    let added = 0;
    while (added < days) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0 && d.getDay() !== 6) added++;
    }
    return d;
  };
  return {
    from: addBusinessDays(option.minDays + supplierLeadDays),
    to: addBusinessDays(option.maxDays + supplierLeadDays)
  };
}
