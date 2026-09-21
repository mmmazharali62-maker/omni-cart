import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiError } from "@/lib/api-error";
import { normalizeAlertEmail } from "@/lib/back-in-stock";

const schema = z.object({ variantId: z.string().min(3), email: z.string().email() });

// Back-in-stock alerts (spec section 15): one per email per variant.
export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());
    const email = normalizeAlertEmail(body.email);

    const variant = await db.productVariant.findUnique({ where: { id: body.variantId } }).catch(() => null);
    if (!variant) return NextResponse.json({ error: "Variant not found" }, { status: 404 });

    const existing = await db.backInStockAlert.findUnique({
      where: { variantId_email: { variantId: body.variantId, email } }
    }).catch(() => null);

    if (existing) {
      if (existing.notifiedAt) {
        return NextResponse.json({ status: "already_notified" });
      }
      return NextResponse.json({ status: "already_subscribed" });
    }

    await db.backInStockAlert.create({ data: { variantId: body.variantId, email } });
    return NextResponse.json({ status: "subscribed" }, { status: 201 });
  } catch (err) {
    return apiError(err);
  }
}
