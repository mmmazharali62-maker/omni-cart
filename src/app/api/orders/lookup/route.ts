import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiError } from "@/lib/api-error";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { z } from "zod";

// Guest order lookup by email + order id (no account needed) - minimal data only.
const lookupSchema = z.object({ orderId: z.string().min(4), email: z.string().email() });

export async function POST(req: NextRequest) {
  try {
    const rl = rateLimit(clientKey(req, "lookup"), 20, 60_000);
    if (!rl.allowed) return NextResponse.json({ error: "Too many lookups" }, { status: 429 });

    const { orderId, email } = lookupSchema.parse(await req.json());
    const order = await db.order.findUnique({ where: { id: orderId }, include: { user: { select: { email: true } } } });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const emailMatch =
      order.guestEmail?.toLowerCase() === email.toLowerCase() ||
      order.user?.email?.toLowerCase() === email.toLowerCase();
    if (!emailMatch) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    return NextResponse.json({
      order: {
        id: order.id,
        status: order.status,
        createdAt: order.createdAt,
        grandTotal: order.grandTotal
      }
    });
  } catch (err) {
    return apiError(err);
  }
}
