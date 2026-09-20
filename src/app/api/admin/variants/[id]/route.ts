import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/guard";
import { apiError } from "@/lib/api-error";
import { z } from "zod";

const updateSchema = z.object({
  options: z.record(z.string()).optional(),
  price: z.number().positive().optional(),
  stock: z.number().int().min(0).max(100000).optional(),
  inventoryOverride: z.boolean().optional()
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const guard = await requireAdmin(["ADMIN", "STORE_MANAGER", "OPERATIONS"]);
    if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });

    const data = updateSchema.parse(await req.json());
    const variant = await db.productVariant
      .update({
        where: { id: params.id },
        data: { options: data.options, price: data.price, stock: data.stock }
      })
      .catch(() => null);
    if (!variant) return NextResponse.json({ error: "Variant not found" }, { status: 404 });

    // Keep Inventory in sync unless a manual override is flagged.
    if (data.stock != null && !data.inventoryOverride) {
      await db.inventory.upsert({
        where: { variantId: variant.id },
        create: { variantId: variant.id, quantity: data.stock },
        update: { quantity: data.stock }
      });
    }

    await db.auditLog.create({ data: { userId: guard.userId, action: "admin.variant.updated", meta: { variantId: params.id } } });
    return NextResponse.json({ variant });
  } catch (err) {
    return apiError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const guard = await requireAdmin(["ADMIN"]);
    if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });
    // Guard: never delete a variant referenced by an order item.
    const used = await db.orderItem.findFirst({ where: { variantId: params.id } });
    if (used) return NextResponse.json({ error: "Cannot delete - variant has order history. Set stock to 0 instead." }, { status: 409 });
    await db.productVariant.delete({ where: { id: params.id } }).catch(() => null);
    await db.auditLog.create({ data: { userId: guard.userId, action: "admin.variant.deleted", meta: { variantId: params.id } } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return apiError(err);
  }
}
