import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/guard";
import { apiError } from "@/lib/api-error";
import { z } from "zod";

const patchSchema = z.object({
  status: z.enum(["open", "pending", "resolved", "closed"]).optional(),
  priority: z.enum(["low", "normal", "high"]).optional()
});

// Support ticket status/priority management (spec section 29).
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const guard = await requireAdmin(["ADMIN", "SUPPORT", "STORE_MANAGER"]);
    if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });

    const data = patchSchema.parse(await req.json());
    const ticket = await db.supportTicket.update({
      where: { id: params.id },
      data
    });
    return NextResponse.json(ticket);
  } catch (err) {
    return apiError(err);
  }
}
