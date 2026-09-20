import { describe, expect, it } from "vitest";
import { estimateDuties, UK_DEMINIMIS_GBP } from "@/lib/shipping/duties";

describe("UK duties", () => {
  it("handles orders under the £135 de-minimis at checkout", () => {
    const d = estimateDuties("GB", 100);
    expect(d.paidAtCheckout).toBe(true);
    expect(d.dutyCents).toBe(0);
    expect(d.note).toBeNull();
  });
  it("warns on DDU orders over the threshold", () => {
    const d = estimateDuties("GB", 200);
    expect(d.paidAtCheckout).toBe(false);
    expect(d.note).toContain("customs");
    expect(d.dutyCents).toBe(1200); // 6% general duty
  });
  it("applies category duty rates", () => {
    expect(estimateDuties("GB", 200, "electronics").dutyCents).toBe(0);
    expect(estimateDuties("GB", 200, "clothing").dutyCents).toBe(2400);
  });
  it("US orders never get duty notes", () => {
    expect(estimateDuties("US", 999).note).toBeNull();
    expect(UK_DEMINIMIS_GBP).toBe(135);
  });
});
