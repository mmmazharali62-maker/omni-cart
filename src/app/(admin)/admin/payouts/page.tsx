import { db } from "@/lib/db";
import { GlassPanel } from "@/components/ui/glass-panel";
import { EmptyState } from "@/components/ui/empty-state";
import { payoutTotals } from "@/lib/payouts";

export const metadata = { title: "Supplier Payouts | Omni Cart" };

// Payouts due (spec section 11/26): pay after delivery + return window.
export default async function AdminPayoutsPage() {
  const payouts = await db.supplierPayout.findMany({ where: { status: "due" }, take: 200 }).catch(() => []);

  const bySupplier = payoutTotals(
    payouts.map((p) => ({ supplierId: p.supplierId, shipmentId: p.shipmentId ?? "", costCents: p.amountCents }))
  );

  return (
    <section className="mx-4 mt-12 max-w-3xl">
      <h1 className="text-3xl font-semibold">Supplier payouts</h1>
      <p className="text-white/50 text-sm mt-1 mb-6">Released 32 days after fulfillment - after the return window closes.</p>
      {bySupplier.length === 0 ? (
        <EmptyState title="Nothing due" message="Payout lines appear as orders are fulfilled." />
      ) : (
        <div className="space-y-3">
          {bySupplier.map((s) => (
            <GlassPanel key={s.supplierId} className="p-5 flex items-center justify-between">
              <div>
                <p className="font-mono text-xs text-white/50">{s.supplierId.slice(0, 12)}</p>
                <p className="text-xs text-white/40 mt-1">{s.shipments} shipment(s)</p>
              </div>
              <p className="text-xl font-semibold">${(s.dueCents / 100).toFixed(2)}</p>
            </GlassPanel>
          ))}
        </div>
      )}
    </section>
  );
}
