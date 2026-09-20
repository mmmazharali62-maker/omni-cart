import { NextRequest, NextResponse } from "next/server";
import { answerAdminQuery } from "@/lib/ai/admin-assistant";

// e.g. "Aaj kitne orders aaye?" (spec section 13).
export async function POST(req: NextRequest) {
  const { question } = await req.json();
  const result = await answerAdminQuery(question ?? "");
  return NextResponse.json(result);
}
