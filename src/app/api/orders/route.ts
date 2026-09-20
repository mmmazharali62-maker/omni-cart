import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  // TODO: scope to the authenticated user via NextAuth session.
  const orders = await db.order.findMany({ orderBy: { createdAt: "desc" }, take: 50, include: { items: true } });
  return NextResponse.json({ orders });
}
