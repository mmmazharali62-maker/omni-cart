import { describe, expect, it } from "vitest";
import { healthVerdict, shouldAutoRoute, supplierHealth } from "@/lib/suppliers/health";

const good = { onTimeRate: 0.95, fulfillmentRate: 0.98, defectRate: 0.02, avgShipDays: 2, stockSyncAgeHours: 6 };
const bad = { onTimeRate: 0.4, fulfillmentRate: 0.5, defectRate: 0.3, avgShipDays: 10, stockSyncAgeHours: 200 };

describe("supplier health", () => {
  it("scores good suppliers high", () => {
    const score = supplierHealth(good);
    expect(score).toBeGreaterThanOrEqual(80);
    expect(healthVerdict(score)).toBe("healthy");
  });
  it("scores poor suppliers as risk", () => {
    const score = supplierHealth(bad);
    expect(score).toBeLessThan(60);
    expect(healthVerdict(score)).toBe("risk");
  });
  it("stale sync data drags the score down", () => {
    const score = supplierHealth({ ...good, stockSyncAgeHours: 500 });
    expect(score).toBeLessThan(supplierHealth(good));
  });
  it("auto-routes only non-risk suppliers", () => {
    expect(shouldAutoRoute(supplierHealth(good))).toBe(true);
    expect(shouldAutoRoute(supplierHealth(bad))).toBe(false);
  });
});
