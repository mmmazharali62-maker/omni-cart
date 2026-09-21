import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { suggestions } from "@/lib/search/tokenize";
import { cache } from "@/lib/cache";

// Typeahead suggestions (spec section 9): cached for a minute at a time.
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.slice(0, 80) ?? "";
  if (q.trim().length < 2) return NextResponse.json({ suggestions: [] });

  const key = `suggest:${q.toLowerCase()}`;
  const cached = cache.get<string[]>(key);
  if (cached) return NextResponse.json({ suggestions: cached });

  const products = await db.product.findMany({
    where: { status: "active" },
    select: { title: true },
    take: 500
  }).catch(() => []);

  const result = suggestions(q, products);
  cache.set(key, result, 60_000, ["search"]);
  return NextResponse.json({ suggestions: result });
}
