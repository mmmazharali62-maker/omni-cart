import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/guard";
import { apiError } from "@/lib/api-error";

// Review moderation queue (spec section 20).
export async function GET(req: NextRequest) {
  try {
    const guard = await requireAdmin(["ADMIN", "STORE_MANAGER", "SUPPORT"]);
    if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });

    const unmoderated = new URL(req.url).searchParams.get("queue") === "1";
    const reviews = await db.review.findMany({
      where: unmoderated ? { isModerated: false } : undefined,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { product: { select: { title: true, slug: true } }, user: { select: { name: true, email: true } } }
    });
    return NextResponse.json({ reviews });
  } catch (err) {
    return apiError(err);
  }
}
