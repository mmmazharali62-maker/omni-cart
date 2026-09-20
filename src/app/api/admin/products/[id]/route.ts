import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/guard";
import { apiError } from "@/lib/api-error";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().max(10000).optional(),
  categoryId: z.string().nullable().optional(),
  basePrice: z.number().positive().optional(),
  salePrice: z.number().positive().nullable().optional(),
  status: z.enum(["draft", "active", "archived"]).optional()
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const guard = await requireAdmin(["ADMIN", "STORE_MANAGER"]);
    if (!guard.ok) return NextResponse.json({ error: guard.status === 401 ? "Unauthorized" : "Forbidden" }, { status: guard.status });

    const data = updateSchema.parse(await req.json());
    const product = await db.product.update({ where: { id: params.id }, data }).catch(() => null);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    await db.auditLog.create({ data: { userId: guard.userId, action: "admin.product.updated", meta: { productId: params.id } } });
    return NextResponse.json({ product });
  } catch (err) {
    return apiError(err);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const guard = await requireAdmin(["ADMIN"]);
    if (!guard.ok) return NextResponse.json({ error: guard.status === 401 ? "Unauthorized" : "Forbidden" }, { status: guard.status });

    // Soft-delete: archive preserves order history integrity.
    const product = await db.product.update({ where: { id: params.id }, data: { status: "archived" } }).catch(() => null);
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    await db.auditLog.create({ data: { userId: guard.userId, action: "admin.product.archived", meta: { productId: params.id } } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return apiError(err);
  }
}
