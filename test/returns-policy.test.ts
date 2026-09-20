import { describe, expect, it } from "vitest";
import { NON_RETURNABLE_CATEGORIES, refundDue, returnEligibility } from "@/lib/returns/policy";

const delivered = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
};

describe("return policy", () => {
  it("allows returns inside the 30-day window", () => {
    const r = returnEligibility(delivered(10), "home-decor");
    expect(r.eligible).toBe(true);
    expect(r.deadline).toBeTruthy();
  });
  it("blocks returns past the window", () => {
    const r = returnEligibility(delivered(31), "home-decor");
    expect(r.eligible).toBe(false);
    expect(r.reason).toContain("window closed");
  });
  it("blocks undelivered orders", () => {
    expect(returnEligibility(null, "home-decor").eligible).toBe(false);
  });
  it("blocks final-sale categories", () => {
    const r = returnEligibility(delivered(2), "intimates");
    expect(r.eligible).toBe(false);
    expect(r.reason).toContain("final-sale");
  });
  it("refunds 100% within 14 days, 85% after", () => {
    expect(refundDue(5000, 10)).toBe(5000);
    expect(refundDue(5000, 20)).toBe(4250);
    expect(refundDue(5000, 45)).toBe(0);
  });
  it("excludes known final-sale categories", () => {
    expect(NON_RETURNABLE_CATEGORIES).toContain("personal-care");
  });
});
