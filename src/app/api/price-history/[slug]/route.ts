import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lowestInWindow, priceDrop } from "@/lib/price-history";

// Public price history for a product (spec section 12): honest price context.
export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const product = await db.product.findUnique({
    where: { slug: params.slug },
    select: { id: true, basePrice: true, salePrice: true }
  }).catch(() => null);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const snapshots = await db.priceSnapshot.findMany({
    where: { productId: product.id },
    orderBy: { capturedAt: "asc" },
    take: 200
  }).catch(() => []);

  const mapped = snapshots.map((s) => ({ price: Number(s.price), capturedAt: s.capturedAt }));
  return NextResponse.json({
    current: Number(product.salePrice ?? product.basePrice),
    history: mapped,
    drop: priceDrop(mapped),
    lowest90d: lowestInWindow(mapped)
  });
}
