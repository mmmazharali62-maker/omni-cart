import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parseNaturalLanguageQuery } from "@/lib/ai/search-assistant";

// Supports both plain keyword search and (future) natural-language queries,
// e.g. "kitchen product under $50" (spec section 2/13).
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const intent = await parseNaturalLanguageQuery(q);

  const products = await db.product.findMany({
    where: {
      status: "active",
      OR: intent.keywords.length
        ? intent.keywords.map((kw) => ({ title: { contains: kw, mode: "insensitive" as const } }))
        : undefined,
      basePrice: { lte: intent.maxPrice, gte: intent.minPrice }
    },
    take: 40
  });
  return NextResponse.json({ products, parsedIntent: intent });
}
