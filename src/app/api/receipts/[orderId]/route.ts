import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { renderReceipt } from "@/lib/receipts";

// Receipt text for an order (spec section 8): owner or admin only.
export async function GET(_req: NextRequest, { params }: { params: { orderId: string } }) {
  const order = await db.order.findUnique({
    where: { id: params.orderId },
    include: { items: true, payment: true }
  }).catch(() => null);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const session = await getServerSession(authOptions).catch(() => null);
  const user = session?.user as { id?: string; role?: string } | undefined;
  const isAdmin = user?.role && ["ADMIN", "SUPPORT", "STORE_MANAGER"].includes(user.role);
  const isOwner = user?.id === order.userId;
  if (!isAdmin && !isOwner) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const receipt = renderReceipt({
    orderNumber: order.id.slice(0, 8).toUpperCase(),
    date: order.createdAt.toISOString().slice(0, 10),
    items: order.items.map((i) => ({ title: i.title, quantity: i.quantity, unitPrice: Number(i.unitPrice) })),
    subtotal: Number(order.subtotal),
    discount: Number(order.discountTotal),
    shipping: Number(order.shippingTotal),
    tax: Number(order.taxTotal),
    total: Number(order.grandTotal),
    currency: order.currency,
    paymentLast4: (order.payment as { last4?: string } | null)?.last4
  });
  return NextResponse.json({ receipt });
}
