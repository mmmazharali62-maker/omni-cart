import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/guard";

// Admin: all return requests (spec section 14/29).
export async function GET() {
  const guard = await requireAdmin(["ADMIN", "SUPPORT", "STORE_MANAGER"]);
  if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });

  const returns = await db.returnRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 200
  });
  return NextResponse.json({ returns });
}
