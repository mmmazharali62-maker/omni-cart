import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Backs the homepage Recently Viewed rail (spec section 1/3).
export async function GET(req: NextRequest) {
  const ids = (new URL(req.url).searchParams.get("ids") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 12);

  if (ids.length === 0) return NextResponse.json({ products: [] });

  const products = await db.product.findMany({ where: { id: { in: ids }, status: "active" } });
  const rank = new Map(ids.map((id, i) => [id, i]));
  const sorted = products.sort((a, b) => (rank.get(a.id) ?? 99) - (rank.get(b.id) ?? 99));

  return NextResponse.json({
    products: sorted.map((p) => ({
      slug: p.slug,
      title: p.title,
      image: p.images[0] ?? "",
      price: Number(p.basePrice),
      salePrice: p.salePrice ? Number(p.salePrice) : undefined,
      currency: p.currency
    }))
  });
}
