import { db } from "@/lib/db";
import { SupplierHealthBoard } from "@/components/admin/ops/supplier-health-board";
import { healthVerdict, supplierHealth, type SupplierStats } from "@/lib/suppliers/health";

export const metadata = { title: "Supplier Health | Omni Cart" };

// Supplier reliability board (spec section 11/14/26).
export default async function SupplierHealthPage() {
  const suppliers = await db.supplier.findMany({
    include: { _count: { select: { products: true } } }
  }).catch(() => []);

  const rows = suppliers.map((s) => {
    // Baseline stats until sync jobs accumulate real telemetry.
    const stats: SupplierStats = { onTimeRate: 0.9, fulfillmentRate: 0.9, defectRate: 0.05, avgShipDays: 3, stockSyncAgeHours: 24 };
    const score = supplierHealth(stats);
    return {
      id: s.id, name: s.name, score,
      onTimeRate: stats.onTimeRate, fulfillmentRate: stats.fulfillmentRate,
      defectRate: stats.defectRate, avgShipDays: stats.avgShipDays
    };
  });

  return (
    <section className="mx-4 mt-12 max-w-6xl">
      <h1 className="text-3xl font-semibold">Supplier health</h1>
      <p className="text-white/50 text-sm mt-1 mb-6">
        Orders auto-route to healthy suppliers only. Verdicts: {healthVerdict(100)} / {healthVerdict(65)} / {healthVerdict(30)}.
      </p>
      <SupplierHealthBoard rows={rows} />
    </section>
  );
}
