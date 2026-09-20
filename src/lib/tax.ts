// Tax calculation for US sales tax + UK VAT (spec section 13).
// US: per-state flat rates at checkout; UK: VAT-inclusive pricing (20%).
export const US_STATE_RATES: Record<string, number> = {
  CA: 0.0885, NY: 0.0888, TX: 0.0825, FL: 0.07, WA: 0.0938,
  IL: 0.0881, PA: 0.0634, OH: 0.0723, GA: 0.0731, NC: 0.0708,
  MI: 0.06, NJ: 0.0663, VA: 0.0573, AZ: 0.0837, MA: 0.0625
};
export const UK_VAT_RATE = 0.2;

// Returns the tax owed on a taxable subtotal for the given destination.
export function calculateTax(subtotalCents: number, country: string, state?: string): number {
  if (subtotalCents <= 0) return 0;
  if (country === "GB") {
    // Prices displayed include VAT; tax owed is the VAT component.
    return Math.round((subtotalCents * UK_VAT_RATE) / (1 + UK_VAT_RATE));
  }
  const rate = state ? (US_STATE_RATES[state.toUpperCase()] ?? 0) : 0;
  return Math.round(subtotalCents * rate);
}

// Whether displayed prices for this destination already include tax.
export function pricesIncludeTax(country: string): boolean {
  return country === "GB";
}
