import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/guard";
import { apiError } from "@/lib/api-error";
import { z } from "zod";

const variantSchema = z.object({
  productId: z.string(),
  sku: z.string().min(2).max(60).regex(/^[A-Za-z0-9_-]+$/),
  options: z.record(z.string()).refine((o) => Object.keys(o).length > 0, "at least one option (e.g. color/size)"),
  price: z.number().positive(),
  stock: z.number().int().min(0).max(100000),
  weightKg: z.number().positive().optional()
});

export async function POST(req: NextRequest) {
  try {
    const guard = await requireAdmin(["ADMIN", "STORE_MANAGER"]);
    if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });

    const input = variantSchema.parse(await req.json());
    const product = await db.product.findUnique({ where: { id: input.productId } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const variant = await db.productVariant
      .create({
        data: {
          productId: input.productId,
          sku: input.sku,
          options: input.options,
          price: input.price,
          stock: input.stock,
          weightKg: input.weightKg,
          inventory: { create: { quantity: input.stock } }
        }
      })
      .catch(() => null);
    if (!variant) return NextResponse.json({ error: "SKU already exists" }, { status: 409 });

    await db.auditLog.create({ data: { userId: guard.userId, action: "admin.variant.created", meta: { variantId: variant.id, sku: variant.sku } } });
    return NextResponse.json({ variant });
  } catch (err) {
    return apiError(err);
  }
}
