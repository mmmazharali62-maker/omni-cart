import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Reviews (spec section 20) with verified-purchase detection + moderation flag.
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productId, rating, title, body } = await req.json();
  if (!productId || !rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "productId and rating (1-5) required" }, { status: 400 });
  }

  // Verified purchase: customer actually received this product.
  const purchased = await db.orderItem.findFirst({
    where: { productId, order: { userId, status: "DELIVERED" } }
  });

  const review = await db.review.create({
    data: {
      productId,
      userId,
      rating: Math.round(rating),
      title,
      body,
      isVerifiedPurchase: Boolean(purchased)
    }
  });
  return NextResponse.json({ review });
}

export async function GET(req: NextRequest) {
  const productId = new URL(req.url).searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });
  const reviews = await db.review.findMany({
    where: { productId },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ reviews });
}
