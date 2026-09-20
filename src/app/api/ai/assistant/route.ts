import { NextRequest, NextResponse } from "next/server";
import { parseNaturalLanguageQuery } from "@/lib/ai/search-assistant";

// AI Product Assistant chat endpoint (spec section 13).
export async function POST(req: NextRequest) {
  const { message } = await req.json();
  const intent = await parseNaturalLanguageQuery(message ?? "");
  return NextResponse.json({ intent });
}
