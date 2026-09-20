import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/products?category=&minPrice=&maxPrice=&sort= (spec section 2 filters).
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") ?? undefined;
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  const products = await db.product.findMany({
    where: {
      status: "active",
      category: category ? { slug: category } : undefined,
      basePrice: {
        gte: minPrice ? Number(minPrice) : undefined,
        lte: maxPrice ? Number(maxPrice) : undefined
      }
    },
    take: 60
  });
  return NextResponse.json({ products });
}
