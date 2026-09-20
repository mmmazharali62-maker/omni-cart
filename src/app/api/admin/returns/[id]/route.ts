import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/guard";
import { apiError } from "@/lib/api-error";
import { canTransition } from "@/lib/returns/status";
import { logIntegrationChange } from "@/lib/integrations/audit";

const patchSchema = z.object({
  status: z.enum(["requested", "approved", "received", "refunded", "rejected", "cancelled"]),
  refundAmount: z.number().min(0).optional(),
  note: z.string().max(500).optional()
});

// Admin: transition a return through its state machine (spec section 29).
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const guard = await requireAdmin(["ADMIN", "SUPPORT", "STORE_MANAGER"]);
    if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });

    const { status, refundAmount, note } = patchSchema.parse(await req.json());
    const existing = await db.returnRequest.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (!canTransition(existing.status, status)) {
      return NextResponse.json({ error: `Can't move a return from ${existing.status} to ${status}` }, { status: 400 });
    }

    const updated = await db.returnRequest.update({
      where: { id: params.id },
      data: { status, refundAmount: refundAmount != null ? refundAmount : undefined, note: note ?? existing.note }
    });

    await logIntegrationChange("INTEGRATION_TESTED", "returns", guard.userId, { action: "return_transition", from: existing.status, to: status });
    return NextResponse.json(updated);
  } catch (err) {
    return apiError(err);
  }
}
