import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/guard";
import { apiError } from "@/lib/api-error";
import { z } from "zod";

const productSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(10000).default(""),
  categoryId: z.string().optional(),
  images: z.array(z.string().url()).default([]),
  basePrice: z.number().positive(),
  salePrice: z.number().positive().optional(),
  currency: z.enum(["USD", "GBP"]).default("USD"),
  status: z.enum(["draft", "active", "archived"]).default("draft")
});

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

export async function POST(req: NextRequest) {
  try {
    const guard = await requireAdmin(["ADMIN", "STORE_MANAGER"]);
    if (!guard.ok) return NextResponse.json({ error: guard.status === 401 ? "Unauthorized" : "Forbidden" }, { status: guard.status });

    const input = productSchema.parse(await req.json());
    const slug = `${slugify(input.title)}-${Date.now().toString(36)}`;

    const product = await db.product.create({
      data: {
        title: input.title,
        slug,
        description: input.description,
        categoryId: input.categoryId,
        images: input.images,
        basePrice: input.basePrice,
        salePrice: input.salePrice,
        currency: input.currency,
        status: input.status
      }
    });
    await db.auditLog.create({ data: { userId: guard.userId, action: "admin.product.created", meta: { productId: product.id } } });
    return NextResponse.json({ product });
  } catch (err) {
    return apiError(err);
  }
}
