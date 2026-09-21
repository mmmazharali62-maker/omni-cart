import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/guard";
import { apiError } from "@/lib/api-error";
import { excludeDisputed, isPayable, payoutTotals, type PayoutLine } from "@/lib/payouts";
import { logIntegrationChange } from "@/lib/integrations/audit";

// Supplier payouts (spec section 11/26): what we owe, and marking paid.
export async function GET() {
  const guard = await requireAdmin(["ADMIN", "STORE_MANAGER"]);
  if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });

  const payouts = await db.supplierPayout.findMany({ where: { status: "due" }, take: 200 }).catch(() => []);
  const lines: PayoutLine[] = payouts.map((p) => ({
    supplierId: p.supplierId, shipmentId: p.shipmentId ?? "", costCents: p.amountCents
  }));
  return NextResponse.json({
    bySupplier: payoutTotals(lines),
    payableNow: payouts.filter((p) => p.paidAt === null && isPayable(new Date(), p.createdAt)).length
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const guard = await requireAdmin(["ADMIN"]);
    if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });

    const { supplierId, disputedSupplierIds = [] } = z
      .object({ supplierId: z.string(), disputedSupplierIds: z.array(z.string()).optional() })
      .parse(await req.json());

    const payouts = await db.supplierPayout.findMany({ where: { supplierId, status: "due" } }).catch(() => []);
    const allowed = excludeDisputed(
      payouts.map((p) => ({ supplierId: p.supplierId, shipmentId: p.id, costCents: p.amountCents })),
      disputedSupplierIds
    );

    for (const line of allowed) {
      await db.supplierPayout.update({
        where: { id: line.shipmentId },
        data: { status: "paid", paidAt: new Date() }
      }).catch(() => null);
    }

    await logIntegrationChange("INTEGRATION_TESTED", "payouts", guard.userId, { supplierId, paid: allowed.length });
    return NextResponse.json({ paid: allowed.length });
  } catch (err) {
    return apiError(err);
  }
}
