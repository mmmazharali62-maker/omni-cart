// Invoice rows for exports (spec section 14/17): accounting-friendly output.
export type InvoiceRow = {
  orderNumber: string; date: string; customerEmail: string;
  subtotal: number; discount: number; shipping: number; tax: number; total: number;
  currency: string; status: string;
};

export function invoiceCsv(rows: InvoiceRow[]): string {
  const header = ["order_number", "date", "customer_email", "subtotal", "discount", "shipping", "tax", "total", "currency", "status"];
  const lines = rows.map((r) => [
    r.orderNumber, r.date, r.customerEmail,
    r.subtotal.toFixed(2), r.discount.toFixed(2), r.shipping.toFixed(2), r.tax.toFixed(2), r.total.toFixed(2),
    r.currency, r.status
  ].join(","));
  return [header.join(","), ...lines].join("\n");
}

// Monthly revenue summary for accounting exports.
export function revenueByMonth(rows: InvoiceRow[]): Array<{ month: string; orders: number; revenue: number }> {
  const byMonth = new Map<string, { orders: number; revenue: number }>();
  for (const r of rows) {
    const month = r.date.slice(0, 7); // YYYY-MM
    const agg = byMonth.get(month) ?? { orders: 0, revenue: 0 };
    agg.orders++;
    agg.revenue = Math.round((agg.revenue + r.total) * 100) / 100;
    byMonth.set(month, agg);
  }
  return [...byMonth.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, v]) => ({ month, ...v }));
}
