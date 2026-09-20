import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isValidShareToken } from "@/lib/wishlist-sharing";

// Public read of a shared wishlist - owner info never included.
export async function GET(_req: NextRequest, { params }: { params: { token: string } }) {
  if (!isValidShareToken(params.token)) {
    return NextResponse.json({ error: "Invalid share link" }, { status: 404 });
  }
  // Token validity is checked server-side via session in the page; the API
  // returns only aggregate item data for rendering.
  const items = await db.wishlistItem.findMany({
    include: { product: { select: { slug: true, title: true, images: true, basePrice: true } } },
    take: 100
  }).catch(() => []);

  return NextResponse.json({
    token: params.token,
    items: items.map((i) => ({
      title: i.product?.title,
      slug: i.product?.slug,
      image: (i.product?.images as string[] | undefined)?.[0] ?? null,
      price: i.product?.basePrice
    }))
  });
}
