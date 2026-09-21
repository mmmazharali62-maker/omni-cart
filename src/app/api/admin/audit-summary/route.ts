import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/guard";
import { actionBreakdown, failedActionRate, suspiciousActors } from "@/lib/audit-summary";

// Audit summary for the ops dashboard (spec section 17/26).
export async function GET() {
  const guard = await requireAdmin(["ADMIN", "STORE_MANAGER"]);
  if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });

  const since = new Date(Date.now() - 7 * 86_400_000);
  const logs = await db.auditLog.findMany({
    where: { createdAt: { gte: since } },
    take: 1000
  }).catch(() => []);

  const entries = logs.map((l) => ({
    id: l.id,
    action: l.action,
    actor: l.userId ?? "system",
    createdAt: l.createdAt.toISOString(),
    success: true
  }));

  return NextResponse.json({
    total: entries.length,
    breakdown: actionBreakdown(entries),
    failureRate: failedActionRate(entries),
    suspicious: suspiciousActors(entries)
  });
}
