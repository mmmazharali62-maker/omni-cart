import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { computeFacets } from "@/lib/search/facets";
import { cache } from "@/lib/cache";

// Facet counts for the shop sidebar (spec section 9).
export async function GET(req: NextRequest) {
  const key = "facets:all";
  const cached = cache.get<unknown>(key);
  if (cached) return NextResponse.json({ facets: cached });

  const products = await db.product.findMany({
    where: { status: "active" },
    select: { categoryId: true, basePrice: true, salePrice: true }
  }).catch(() => []);

  const facets = computeFacets(
    products.map((p) => ({
      categoryId: p.categoryId,
      price: Number(p.salePrice ?? p.basePrice),
      inStock: true // ACTIVE products are sellable; per-variant stock lives in Inventory
    }))
  );
  cache.set(key, facets, 60_000, ["products"]);
  return NextResponse.json({ facets });
}
