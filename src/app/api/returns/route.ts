import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiError } from "@/lib/api-error";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { RETURN_REASONS } from "@/lib/returns/reasons";
import { stripTags } from "@/lib/security/sanitize";

const createSchema = z.object({
  orderId: z.string().min(5).max(64),
  email: z.string().email(),
  reason: z.enum(RETURN_REASONS.map((r) => r.code) as [string, ...string[]]),
  note: z.string().max(1000).optional(),
  itemIds: z.array(z.string()).min(1).max(20)
});

// Create a return request (spec section 29). Session optional - guests use email.
export async function POST(req: NextRequest) {
  try {
    const body = createSchema.parse(await req.json());
    const order = await db.order.findUnique({
      where: { id: body.orderId },
      include: { items: true }
    });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const email = body.email.toLowerCase();
    const owns = (order.guestEmail?.toLowerCase() === email) || (await getServerSession(authOptions).catch(() => null) as any)?.user?.id === order.userId;
    if (!owns) return NextResponse.json({ error: "Email doesn't match this order" }, { status: 403 });

    const items = order.items.filter((i) => body.itemIds.includes(i.id));
    if (items.length === 0) return NextResponse.json({ error: "None of those items belong to the order" }, { status: 400 });

    const returnRequest = await db.returnRequest.create({
      data: {
        orderId: order.id,
        userId: order.userId,
        email,
        items: items.map((i) => ({ orderItemId: i.id, title: i.title, quantity: i.quantity, price: Number(i.unitPrice) })),
        reason: body.reason,
        note: body.note ? stripTags(body.note) : null
      }
    });
    return NextResponse.json({ id: returnRequest.id, status: returnRequest.status }, { status: 201 });
  } catch (err) {
    return apiError(err);
  }
}

// List the caller's return requests.
export async function GET() {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ returns: [] });

  const returns = await db.returnRequest.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50
  });
  return NextResponse.json({ returns });
}
