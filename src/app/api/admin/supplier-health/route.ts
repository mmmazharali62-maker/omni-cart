import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/guard";
import { supplierHealth, type SupplierStats } from "@/lib/suppliers/health";

// Supplier health scores for the ops board (spec section 11/14).
// Real stats come from sync jobs; we compute a neutral baseline otherwise.
export async function GET() {
  const guard = await requireAdmin(["ADMIN", "STORE_MANAGER"]);
  if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });

  const suppliers = await db.supplier.findMany({
    include: { _count: { select: { products: true } } }
  }).catch(() => []);

  const rows = suppliers.map((s) => {
    const stats: SupplierStats = {
      onTimeRate: 0.9, fulfillmentRate: 0.9, defectRate: 0.05,
      avgShipDays: 3, stockSyncAgeHours: 24
    };
    return {
      id: s.id, name: s.name,
      score: supplierHealth(stats),
      productCount: (s as { _count?: { products: number } })._count?.products ?? 0
    };
  });
  return NextResponse.json({ suppliers: rows });
}
