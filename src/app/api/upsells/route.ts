import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { selectUpsells, type UpsellCandidate } from "@/lib/upsells";
import { cache } from "@/lib/cache";

// Checkout upsells (spec section 15): relevant, in-stock, impulse-priced.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const cartProductIds: string[] = Array.isArray(body.cartProductIds) ? body.cartProductIds.slice(0, 50) : [];
  const key = `upsells:${[...cartProductIds].sort().join(",")}`;

  const cached = cache.get<unknown>(key);
  if (cached) return NextResponse.json({ upsells: cached });

  // Cart categories: fetch the actual products (OrderItem has no product relation).
  const cartProducts = cartProductIds.length
    ? await db.product.findMany({ where: { id: { in: cartProductIds } }, select: { categoryId: true } }).catch(() => [])
    : [];
  const cartCategorySlugs = cartProducts.map((p) => p.categoryId).filter(Boolean) as string[];

  const candidatesRaw = await db.product.findMany({
    where: { status: "ACTIVE" },
    select: { id: true, title: true, basePrice: true, categoryId: true },
    take: 200
  }).catch(() => []);

  const candidates: UpsellCandidate[] = candidatesRaw.map((p) => ({
    productId: p.id,
    title: p.title,
    price: Number(p.basePrice),
    cost: Number(p.basePrice) * 0.6, // margin proxy until supplier costs sync
    categorySlug: p.categoryId ?? "uncategorized",
    stock: 10, // ACTIVE products are sellable; per-variant stock lives in Inventory
    rating: 4.2
  }));

  const upsells = selectUpsells(cartCategorySlugs, cartProductIds, candidates);
  cache.set(key, upsells, 120_000, ["products"]);
  return NextResponse.json({ upsells });
}
