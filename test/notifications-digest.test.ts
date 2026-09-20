import { describe, expect, it } from "vitest";
import { digestSeverity, renderDigest } from "@/lib/notifications/digest";

const base = {
  date: "2026-09-19", ordersCount: 12, revenueCents: 120_000,
  newCustomers: 5, pendingReturns: 1, lowStockCount: 0, failedSyncs: 0,
  topProduct: "Wireless Earbuds"
};

describe("daily digest", () => {
  it("renders a calm all-clear digest", () => {
    const { subject, body } = renderDigest(base);
    expect(subject).toContain("12 orders");
    expect(body).toContain("All clear today");
    expect(body).toContain("Wireless Earbuds");
  });
  it("lists warnings when things need attention", () => {
    const { body } = renderDigest({ ...base, failedSyncs: 2, lowStockCount: 4 });
    expect(body).toContain("2 supplier sync failure(s)");
    expect(body).toContain("4 product(s)");
  });
  it("grades severity", () => {
    expect(digestSeverity(base)).toBe("ok");
    expect(digestSeverity({ ...base, pendingReturns: 6 })).toBe("warning");
    expect(digestSeverity({ ...base, failedSyncs: 9 })).toBe("critical");
  });
});
