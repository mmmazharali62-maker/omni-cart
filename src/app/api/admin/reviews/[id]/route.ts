import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/guard";
import { apiError } from "@/lib/api-error";
import { z } from "zod";

const decisionSchema = z.object({ decision: z.enum(["approve", "hide", "delete"]) });

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const guard = await requireAdmin(["ADMIN", "STORE_MANAGER", "SUPPORT"]);
    if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });

    const { decision } = decisionSchema.parse(await req.json());

    if (decision === "delete") {
      await db.review.delete({ where: { id: params.id } });
    } else {
      await db.review.update({
        where: { id: params.id },
        data: { isModerated: true, isHidden: decision === "hide" }
      });
    }
    await db.auditLog.create({ data: { userId: guard.userId, action: `admin.review.${decision}`, meta: { reviewId: params.id } } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return apiError(err);
  }
}
