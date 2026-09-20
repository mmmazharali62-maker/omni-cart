import { describe, expect, it } from "vitest";
import { renderRefundIssued } from "@/lib/notifications/templates/refund-issued";

describe("refund-issued template", () => {
  it("states amount, method, and timing", () => {
    const t = renderRefundIssued({ orderNumber: "OC-1", amount: "$25.00", method: "Visa card" });
    expect(t.subject).toContain("Refund");
    expect(t.body).toContain("$25.00");
    expect(t.body).toContain("Visa card");
    expect(t.body).toContain("5-10 business days");
  });
  it("optionally includes a reason", () => {
    const t = renderRefundIssued({ orderNumber: "X", amount: "$5", method: "card", reason: "arrived damaged" });
    expect(t.body).toContain("arrived damaged");
  });
});
