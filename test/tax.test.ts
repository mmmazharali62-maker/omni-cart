import { describe, expect, it } from "vitest";
import { calculateTax, pricesIncludeTax, UK_VAT_RATE } from "@/lib/tax";

describe("tax", () => {
  it("charges state sales tax in the US", () => {
    expect(calculateTax(10000, "US", "CA")).toBe(885);
    expect(calculateTax(10000, "US", "MI")).toBe(600);
  });
  it("is 0 for unknown/absent US states", () => {
    expect(calculateTax(10000, "US")).toBe(0);
    expect(calculateTax(10000, "US", "XX")).toBe(0);
  });
  it("extracts the VAT component for GB (prices include tax)", () => {
    const subtotal = 10000;
    const vat = calculateTax(subtotal, "GB");
    expect(vat).toBe(Math.round((subtotal * UK_VAT_RATE) / (1 + UK_VAT_RATE)));
    expect(vat).toBe(1667);
  });
  it("never taxes negative/zero subtotals", () => {
    expect(calculateTax(-100, "US", "CA")).toBe(0);
    expect(calculateTax(0, "GB")).toBe(0);
  });
  it("marks GB as tax-inclusive display", () => {
    expect(pricesIncludeTax("GB")).toBe(true);
    expect(pricesIncludeTax("US")).toBe(false);
  });
});
