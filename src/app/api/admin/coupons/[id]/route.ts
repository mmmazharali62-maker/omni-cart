import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/guard";
import { apiError } from "@/lib/api-error";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const guard = await requireAdmin(["ADMIN", "STORE_MANAGER"]);
    if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });
    const { isActive } = await req.json();
    const coupon = await db.coupon.update({ where: { id: params.id }, data: { isActive } }).catch(() => null);
    if (!coupon) return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    await db.auditLog.create({ data: { userId: guard.userId, action: "admin.coupon.toggled", meta: { code: coupon.code, isActive } } });
    return NextResponse.json({ coupon });
  } catch (err) {
    return apiError(err);
  }
}
