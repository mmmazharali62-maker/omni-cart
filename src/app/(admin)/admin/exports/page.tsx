import { db } from "@/lib/db";
import { GlassPanel } from "@/components/ui/glass-panel";
import { invoiceCsv, revenueByMonth, type InvoiceRow } from "@/lib/export/invoices";
import { taxByRegion, vatReturnSummary } from "@/lib/tax-reports";
import { DownloadButton } from "./download-button";

export const metadata = { title: "Exports | Omni Cart" };

// Accounting exports (spec section 14/17): invoices + tax summaries.
export default async function AdminExportsPage() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 500
  }).catch(() => []);

  const rows: InvoiceRow[] = orders.map((o) => ({
    orderNumber: o.id.slice(0, 8).toUpperCase(),
    date: o.createdAt.toISOString().slice(0, 10),
    customerEmail: o.guestEmail ?? "customer",
    subtotal: Number(o.subtotal), discount: Number(o.discountTotal),
    shipping: Number(o.shippingTotal), tax: Number(o.taxTotal), total: Number(o.grandTotal),
    currency: o.currency, status: o.status
  }));

  const monthly = revenueByMonth(rows);
  const taxRegions = taxByRegion(rows.map((r) => ({
    date: r.date, country: r.currency === "GBP" ? "GB" : "US", taxable: r.subtotal, taxCollected: r.tax
  })));
  const vat = vatReturnSummary(rows.map((r) => ({ date: r.date, country: "GB", taxable: r.subtotal, taxCollected: r.tax })));

  return (
    <section className="mx-4 mt-12 max-w-4xl">
      <h1 className="text-3xl font-semibold">Exports</h1>
      <p className="text-white/50 text-sm mt-1 mb-6">Download-ready accounting files.</p>

      <GlassPanel className="p-5 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-medium">Invoices CSV</h2>
            <p className="text-xs text-white/50 mt-1">{rows.length} orders (last 500)</p>
          </div>
          <DownloadButton filename="omnicart-invoices.csv" content={invoiceCsv(rows)} />
        </div>
      </GlassPanel>

      <GlassPanel className="p-5 mb-4">
        <h2 className="font-medium mb-3">Revenue by month</h2>
        {monthly.length === 0 ? (
          <p className="text-sm text-white/50">No orders yet.</p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {monthly.map((m) => (
                <tr key={m.month} className="border-t border-white/10 first:border-t-0">
                  <td className="py-2 text-white/60">{m.month}</td>
                  <td className="py-2">{m.orders} orders</td>
                  <td className="py-2 text-right font-medium">${m.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </GlassPanel>

      <GlassPanel className="p-5">
        <h2 className="font-medium mb-3">Tax by region</h2>
        <ul className="text-sm space-y-1">
          {taxRegions.slice(0, 8).map((t) => (
            <li key={t.region} className="flex justify-between border-t border-white/10 first:border-t-0 py-2">
              <span className="text-white/60">{t.region}</span>
              <span>${t.tax.toFixed(2)} tax on ${t.taxable.toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-white/40 mt-3">UK VAT return: £{vat.outputVat.toFixed(2)} output VAT on £{vat.totalExVat.toFixed(2)} ex-VAT sales.</p>
      </GlassPanel>
    </section>
  );
}
