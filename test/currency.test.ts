import { describe, expect, it } from "vitest";
import { convert, formatMoney, fromCents, toCents } from "@/lib/currency";

describe("currency", () => {
  it("formats USD and GBP", () => {
    expect(formatMoney(19.99, "USD")).toBe("$19.99");
    expect(formatMoney(19.99, "GBP")).toContain("19.99");
  });
  it("converts USD <-> GBP symmetrically (approx)", () => {
    const gbp = convert(100, "USD", "GBP");
    const back = convert(gbp, "GBP", "USD");
    expect(back).toBe(100);
  });
  it("same-currency conversion is a passthrough", () => {
    expect(convert(19.99, "USD", "USD")).toBe(19.99);
  });
  it("cent math rounds cleanly", () => {
    expect(toCents(19.999)).toBe(2000);
    expect(fromCents(2000)).toBe(20);
  });
});
