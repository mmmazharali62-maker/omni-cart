import { describe, expect, it } from "vitest";
import { renderReceipt, renderRefundReceipt } from "@/lib/receipts";

const order = {
  orderNumber: "INV-202609-00042", date: "2026-09-20",
  items: [{ title: "Desk Lamp", quantity: 2, unitPrice: 24.99 }],
  subtotal: 49.98, discount: 5, shipping: 0, tax: 3.5, total: 48.48,
  currency: "USD", paymentLast4: "4242"
};

describe("receipts", () => {
  it("renders a complete receipt", () => {
    const r = renderReceipt(order);
    expect(r).toContain("Desk Lamp");
    expect(r).toContain("$49.98");
    expect(r).toContain("$48.48");
    expect(r).toContain("4242");
    expect(r).toContain("Free");
  });
  it("uses pounds for GBP orders", () => {
    const r = renderReceipt({ ...order, currency: "GBP" });
    expect(r).toContain("\u00A3");
  });
  it("renders refund receipts with timing", () => {
    const r = renderRefundReceipt(order, 20);
    expect(r).toContain("$20.00");
    expect(r).toContain("5-10 business days");
  });
});
