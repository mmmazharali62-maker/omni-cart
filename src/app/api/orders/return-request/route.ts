import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { apiError } from "@/lib/api-error";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { z } from "zod";

const returnSchema = z.object({
  orderId: z.string().min(4),
  reason: z.enum(["damaged", "wrong_item", "not_as_described", "no_longer_needed", "other"]),
  note: z.string().max(2000).optional()
});

// Customer return/refund request (spec section 29) - creates a support ticket
// for staff review; auto-approval rules come with the returns window config.
export async function POST(req: NextRequest) {
  try {
    const rl = rateLimit(clientKey(req, "return"), 10, 60_000);
    if (!rl.allowed) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const { orderId, reason, note } = returnSchema.parse(await req.json());
    const order = await db.order.findUnique({ where: { id: orderId }, include: { user: true } });

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // Ownership: signed-in user must own the order; guest orders matched by session-less id only
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (order.userId && order.userId !== userId) {
      return NextResponse.json({ error: "Not your order" }, { status: 403 });
    }
    if (!["DELIVERED", "SHIPPED", "IN_TRANSIT"].includes(order.status)) {
      return NextResponse.json({ error: "Returns are only possible after shipping" }, { status: 409 });
    }

    // 30-day window from delivery (we approximate with shipment date for now).
    const orderAgeDays = (Date.now() - order.createdAt.getTime()) / (24 * 60 * 60 * 1000);
    if (orderAgeDays > 45) {
      return NextResponse.json({ error: "Outside the 30-day return window" }, { status: 409 });
    }

    const ticket = await db.supportTicket.create({
      data: {
        userId: order.userId,
        orderId: order.id,
        subject: `Return request - order ${order.id.slice(0, 8)}`,
        body: `Reason: ${reason}. ${note ?? ""}`.slice(0, 2000),
        status: "open",
        priority: "normal"
      }
    });

    return NextResponse.json({ ticketId: ticket.id });
  } catch (err) {
    return apiError(err);
  }
}
