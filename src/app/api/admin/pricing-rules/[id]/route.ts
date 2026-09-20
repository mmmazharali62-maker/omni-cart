import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/guard";
import { apiError } from "@/lib/api-error";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const guard = await requireAdmin(["ADMIN", "STORE_MANAGER"]);
    if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });
    await db.pricingRule.delete({ where: { id: params.id } }).catch(() => null);
    await db.auditLog.create({ data: { userId: guard.userId, action: "admin.pricing_rule.deleted", meta: { ruleId: params.id } } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return apiError(err);
  }
}
