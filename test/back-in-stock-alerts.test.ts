import { describe, expect, it } from "vitest";
import { batchCap, normalizeAlertEmail, pendingAlerts, shouldNotify } from "@/lib/back-in-stock";

describe("back-in-stock alerts", () => {
  const alert = { variantId: "v1", email: "a@b.com", notifiedAt: null };

  it("notifies only un-notified subscribers when stock returns", () => {
    expect(shouldNotify(alert, 3)).toBe(true);
    expect(shouldNotify(alert, 0)).toBe(false);
    expect(shouldNotify({ ...alert, notifiedAt: new Date() }, 3)).toBe(false);
  });

  it("groups pending alerts per variant", () => {
    const grouped = pendingAlerts([
      alert,
      { variantId: "v1", email: "c@d.com", notifiedAt: null },
      { variantId: "v2", email: "a@b.com", notifiedAt: new Date() }
    ]);
    expect(grouped.get("v1")).toHaveLength(2);
    expect(grouped.has("v2")).toBe(false); // already notified
  });

  it("normalizes emails and caps batches", () => {
    expect(normalizeAlertEmail("  A@B.COM ")).toBe("a@b.com");
    expect(batchCap(Array.from({ length: 700 }, (_, i) => ({ ...alert, email: `x${i}@y.com` })))).toHaveLength(500);
  });
});
