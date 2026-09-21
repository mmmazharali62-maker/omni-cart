import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/guard";
import { apiError } from "@/lib/api-error";
import { adjustedPrice, bulkActionSchema, requiresOwnerRole, validateBulkAction } from "@/lib/bulk-actions";
import { logIntegrationChange } from "@/lib/integrations/audit";

// Bulk product operations (spec section 14): one command, N products, audited.
export async function POST(req: NextRequest) {
  try {
    const action = bulkActionSchema.parse(await req.json());
    const problem = validateBulkAction(action);
    if (problem) return NextResponse.json({ error: problem }, { status: 400 });

    const guard = await requireAdmin(requiresOwnerRole(action.command) ? ["ADMIN"] : ["ADMIN", "STORE_MANAGER"]);
    if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });

    let affected = 0;
    switch (action.command) {
      case "activate":
        affected = (await db.product.updateMany({ where: { id: { in: action.productIds } }, data: { status: "active" } })).count;
        break;
      case "deactivate":
        affected = (await db.product.updateMany({ where: { id: { in: action.productIds } }, data: { status: "draft" } })).count;
        break;
      case "delete":
        affected = (await db.product.deleteMany({ where: { id: { in: action.productIds } } })).count;
        break;
      case "adjust-price": {
        const products = await db.product.findMany({ where: { id: { in: action.productIds } }, select: { id: true, basePrice: true } });
        for (const p of products) {
          await db.product.update({
            where: { id: p.id },
            data: { basePrice: adjustedPrice(Number(p.basePrice), action.adjustPct ?? 0) }
          });
        }
        affected = products.length;
        break;
      }
      case "reassign-supplier":
        affected = (await db.orderItem.updateMany({ where: { productId: { in: action.productIds } }, data: { supplierId: action.supplierId } })).count;
        break;
      case "export": {
        const products = await db.product.findMany({ where: { id: { in: action.productIds } }, select: { slug: true, title: true, basePrice: true } });
        return NextResponse.json({ products });
      }
    }

    await logIntegrationChange("INTEGRATION_TESTED", "bulk", guard.userId, { command: action.command, affected });
    return NextResponse.json({ message: `${affected} product(s) updated`, affected });
  } catch (err) {
    return apiError(err);
  }
}
