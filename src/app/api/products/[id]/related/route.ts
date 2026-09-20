import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cache } from "@/lib/cache";

// Related products (spec section 3): same category, same price band, cached 5 min.
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const key = `related:${params.id}`;
  const cached = cache.get<unknown[]>(key);
  if (cached) return NextResponse.json({ products: cached });

  const product = await db.product.findUnique({
    where: { id: params.id },
    select: { categoryId: true, basePrice: true }
  }).catch(() => null);

  if (!product?.categoryId) return NextResponse.json({ products: [] });

  const related = await db.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: params.id },
      status: "ACTIVE"
    },
    select: { id: true, slug: true, title: true, basePrice: true, salePrice: true, images: true },
    take: 8
  }).catch(() => []);

  cache.set(key, related, 300_000, ["products"]);
  return NextResponse.json({ products: related });
}
