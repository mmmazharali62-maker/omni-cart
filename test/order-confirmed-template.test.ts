import { describe, expect, it } from "vitest";
import { renderOrderConfirmed } from "@/lib/notifications/templates/order-confirmed";

describe("order-confirmed template", () => {
  it("includes the order number and items", () => {
    const t = renderOrderConfirmed({
      orderNumber: "OC-2609-ABCD",
      items: [{ title: "Desk Lamp", quantity: 2, price: "$24.99" }],
      total: "$49.98"
    });
    expect(t.subject).toContain("OC-2609-ABCD");
    expect(t.body).toContain("2x Desk Lamp");
    expect(t.body).toContain("$49.98");
  });
  it("adds an ETA window when known", () => {
    const t = renderOrderConfirmed({
      orderNumber: "X", items: [], total: "$0", etaWindow: "Oct 1-7"
    });
    expect(t.body).toContain("Oct 1-7");
  });
});
