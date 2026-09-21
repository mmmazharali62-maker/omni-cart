import { describe, expect, it } from "vitest";
import { excludeDisputed, isPayable, payableOn, payoutTotals } from "@/lib/payouts";

describe("supplier payouts", () => {
  it("totals per supplier", () => {
    const totals = payoutTotals([
      { supplierId: "cj", shipmentId: "s1", costCents: 1000 },
      { supplierId: "cj", shipmentId: "s2", costCents: 500 },
      { supplierId: "ali", shipmentId: "s3", costCents: 300 }
    ]);
    expect(totals).toEqual([
      { supplierId: "cj", dueCents: 1500, shipments: 2 },
      { supplierId: "ali", dueCents: 300, shipments: 1 }
    ]);
  });
  it("pays only after the return window closes", () => {
    const fulfilled = new Date("2026-09-01");
    const due = payableOn(fulfilled);
    expect(due.getDate()).toBe(3); // Oct 3 = 30 days + 2
    expect(isPayable(new Date("2026-10-02"), fulfilled)).toBe(false);
    expect(isPayable(new Date("2026-10-04"), fulfilled)).toBe(true);
  });
  it("freezes disputed suppliers' batches", () => {
    const allowed = excludeDisputed(
      [{ supplierId: "cj", shipmentId: "s1", costCents: 1 }, { supplierId: "ali", shipmentId: "s2", costCents: 1 }],
      ["cj"]
    );
    expect(allowed.map((l) => l.supplierId)).toEqual(["ali"]);
  });
});
