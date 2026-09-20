import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/guard";
import { apiError } from "@/lib/api-error";
import { z } from "zod";

const ruleSchema = z.object({
  name: z.string().min(2).max(80),
  type: z.enum(["fixed_markup", "percentage_markup"]),
  value: z.number().positive(),
  minProfit: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  roundTo: z.enum(["0.99", "0.95"]).optional(),
  categoryId: z.string().optional(),
  supplierId: z.string().optional(),
  priority: z.number().int().min(0).max(100).default(0)
});

export async function GET() {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });
    const rules = await db.pricingRule.findMany({ orderBy: [{ priority: "desc" }, { createdAt: "desc" }] });
    return NextResponse.json({ rules });
  } catch (err) {
    return apiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const guard = await requireAdmin(["ADMIN", "STORE_MANAGER"]);
    if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });
    const input = ruleSchema.parse(await req.json());
    const rule = await db.pricingRule.create({ data: { ...input, roundTo: input.roundTo } });
    await db.auditLog.create({ data: { userId: guard.userId, action: "admin.pricing_rule.created", meta: { ruleId: rule.id } } });
    return NextResponse.json({ rule });
  } catch (err) {
    return apiError(err);
  }
}
