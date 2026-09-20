import { describe, expect, it } from "vitest";
import { approachingVatThreshold, taxByRegion, vatReturnSummary, UK_VAT_THRESHOLD } from "@/lib/tax-reports";

const orders = [
  { date: "2026-09-01", country: "US", state: "CA", taxable: 100, taxCollected: 8.85 },
  { date: "2026-09-02", country: "US", state: "CA", taxable: 50, taxCollected: 4.43 },
  { date: "2026-09-03", country: "GB", taxable: 80, taxCollected: 13.33 }
];

describe("tax reports", () => {
  it("groups tax by region, biggest first", () => {
    const regions = taxByRegion(orders);
    expect(regions[0].region).toBe("UK (VAT)"); // 13.33 > 13.28
    const ca = regions.find((r) => r.region === "US-CA")!;
    expect(ca.orders).toBe(2);
    expect(ca.tax).toBe(13.28);
  });
  it("summarizes the UK VAT return", () => {
    const vat = vatReturnSummary(orders);
    expect(vat.totalExVat).toBe(80);
    expect(vat.outputVat).toBe(13.33);
  });
  it("nags near the registration threshold", () => {
    expect(approachingVatThreshold(50_000)).toBe(false);
    expect(approachingVatThreshold(80_000)).toBe(true);
    expect(UK_VAT_THRESHOLD).toBe(90_000);
  });
});
