import { describe, expect, it } from "vitest";
import { computeAllStatuses, computeProviderStatus, overallReadiness } from "@/lib/integrations/status";
import { PROVIDERS } from "@/lib/integrations/catalog";

const stripe = PROVIDERS.find((p) => p.id === "stripe")!;

describe("integration status", () => {
  it("reports missing required fields", () => {
    const st = computeProviderStatus(stripe, {});
    expect(st.ready).toBe(false);
    expect(st.missing).toContain("Secret key");
  });
  it("is ready when all required fields are saved", () => {
    const st = computeProviderStatus(stripe, {
      stripe: { savedFields: ["publishableKey", "secretKey"], isActive: true }
    });
    expect(st.ready).toBe(true);
    expect(st.active).toBe(true);
    expect(st.missing).toHaveLength(0);
  });
  it("computes statuses and overall readiness", () => {
    const all = computeAllStatuses(PROVIDERS, {
      database: { savedFields: ["url"], isActive: true },
      stripe: { savedFields: ["publishableKey", "secretKey"], isActive: true }
    });
    expect(all).toHaveLength(PROVIDERS.length);
    expect(overallReadiness(all)).toBe(Math.round((2 / PROVIDERS.length) * 100));
  });
  it("handles zero providers", () => {
    expect(overallReadiness([])).toBe(0);
  });
});
