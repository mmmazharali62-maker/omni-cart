import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { renderReceipt } from "@/lib/receipts";
import { formatInvoiceNumber } from "@/lib/invoice-numbers";

// Invoice download (spec section 17): CSV-ish text invoice, owner or admin.
export async function GET(_req: NextRequest, { params }: { params: { orderId: string } }) {
  const order = await db.order.findUnique({
    where: { id: params.orderId },
    include: { items: true }
  }).catch(() => null);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const session = await getServerSession(authOptions).catch(() => null);
  const user = session?.user as { id?: string; role?: string } | undefined;
  const isAdmin = user?.role && ["ADMIN", "SUPPORT", "STORE_MANAGER"].includes(user.role);
  if (!isAdmin && user?.id !== order.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const invoiceNumber = formatInvoiceNumber(
    order.createdAt.getFullYear(),
    order.createdAt.getMonth() + 1,
    Math.max(1, Math.abs(hash(order.id) % 90000) + 1)
  );

  const receipt = renderReceipt({
    orderNumber: invoiceNumber,
    date: order.createdAt.toISOString().slice(0, 10),
    items: order.items.map((i) => ({ title: i.title, quantity: i.quantity, unitPrice: Number(i.unitPrice) })),
    subtotal: Number(order.subtotal),
    discount: Number(order.discountTotal),
    shipping: Number(order.shippingTotal),
    tax: Number(order.taxTotal),
    total: Number(order.grandTotal),
    currency: order.currency
  });

  return new NextResponse(receipt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="invoice-${invoiceNumber}.txt"`
    }
  });
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h * 31) + s.charCodeAt(i)) >>> 0;
  return h;
}
