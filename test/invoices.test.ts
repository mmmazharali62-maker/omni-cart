import { describe, expect, it } from "vitest";
import { invoiceCsv, revenueByMonth } from "@/lib/export/invoices";
import type { InvoiceRow } from "@/lib/export/invoices";

const rows: InvoiceRow[] = [
  { orderNumber: "OC-A", date: "2026-08-15", customerEmail: "a@b.com", subtotal: 50, discount: 5, shipping: 6, tax: 3.5, total: 54.5, currency: "USD", status: "DELIVERED" },
  { orderNumber: "OC-B", date: "2026-08-20", customerEmail: "c@d.com", subtotal: 20, discount: 0, shipping: 0, tax: 1.4, total: 21.4, currency: "USD", status: "PAID" },
  { orderNumber: "OC-C", date: "2026-09-02", customerEmail: "e@f.com", subtotal: 10, discount: 0, shipping: 5, tax: 0.7, total: 15.7, currency: "USD", status: "DELIVERED" }
];

describe("invoice exports", () => {
  it("renders a header + one line per order", () => {
    const csv = invoiceCsv(rows);
    const lines = csv.split("\n");
    expect(lines[0]).toContain("order_number");
    expect(lines[0]).toContain("total");
    expect(lines).toHaveLength(4);
    expect(lines[1]).toContain("OC-A,2026-08-15,a@b.com");
  });
  it("aggregates revenue by month", () => {
    const byMonth = revenueByMonth(rows);
    expect(byMonth).toEqual([
      { month: "2026-08", orders: 2, revenue: 75.9 },
      { month: "2026-09", orders: 1, revenue: 15.7 }
    ]);
  });
  it("handles empty exports", () => {
    expect(invoiceCsv([])).toBe("order_number,date,customer_email,subtotal,discount,shipping,tax,total,currency,status");
    expect(revenueByMonth([])).toEqual([]);
  });
});
