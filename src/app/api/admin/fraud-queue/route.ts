import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/guard";
import { apiError } from "@/lib/api-error";
import { logIntegrationChange } from "@/lib/integrations/audit";

const patchSchema = z.object({
  flagId: z.string().min(3),
  status: z.enum(["cleared", "cancelled"])
});

// Fraud review queue (spec section 17): list + decide.
export async function GET() {
  const guard = await requireAdmin(["ADMIN", "SUPPORT", "STORE_MANAGER"]);
  if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });

  const flags = await db.fraudFlag.findMany({
    where: { status: "open" },
    orderBy: { score: "desc" },
    take: 100
  }).catch(() => []);
  return NextResponse.json({ flags });
}

export async function PATCH(req: NextRequest) {
  try {
    const guard = await requireAdmin(["ADMIN", "SUPPORT", "STORE_MANAGER"]);
    if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });

    const { flagId, status } = patchSchema.parse(await req.json());
    const updated = await db.fraudFlag.update({
      where: { id: flagId },
      data: { status, reviewedBy: guard.userId, reviewedAt: new Date() }
    });
    await logIntegrationChange("INTEGRATION_TESTED", "fraud", guard.userId, { flagId, status });
    return NextResponse.json(updated);
  } catch (err) {
    return apiError(err);
  }
}
