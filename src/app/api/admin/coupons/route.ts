import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/guard";
import { apiError } from "@/lib/api-error";
import { z } from "zod";

const couponSchema = z.object({
  code: z.string().min(3).max(40).regex(/^[A-Za-z0-9_-]+$/),
  type: z.enum(["percentage", "fixed", "free_shipping"]),
  value: z.number().positive().optional(), // required for percentage/fixed
  minOrderAmount: z.number().positive().optional(),
  startsAt: z.string().datetime().optional(),
  endsAt: z.string().datetime().optional(),
  usageLimit: z.number().int().positive().optional()
});

export async function GET() {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });
    const coupons = await db.coupon.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ coupons });
  } catch (err) {
    return apiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const guard = await requireAdmin(["ADMIN", "STORE_MANAGER"]);
    if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });

    const input = couponSchema.parse(await req.json());
    if (input.type !== "free_shipping" && !input.value) {
      return NextResponse.json({ error: "value is required for percentage/fixed coupons" }, { status: 400 });
    }

    const coupon = await db.coupon.create({
      data: {
        code: input.code.toUpperCase(),
        type: input.type,
        value: input.value,
        minOrderAmount: input.minOrderAmount,
        startsAt: input.startsAt ? new Date(input.startsAt) : undefined,
        endsAt: input.endsAt ? new Date(input.endsAt) : undefined,
        usageLimit: input.usageLimit,
        isActive: true
      }
    }).catch(() => null);
    if (!coupon) return NextResponse.json({ error: "Coupon code already exists" }, { status: 409 });

    await db.auditLog.create({ data: { userId: guard.userId, action: "admin.coupon.created", meta: { code: coupon.code } } });
    return NextResponse.json({ coupon });
  } catch (err) {
    return apiError(err);
  }
}
