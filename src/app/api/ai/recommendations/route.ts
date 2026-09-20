import { NextRequest, NextResponse } from "next/server";
import { getRecommendedProducts } from "@/lib/ai/recommendations";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const productIds = await getRecommendedProducts(body);
  return NextResponse.json({ productIds });
}
