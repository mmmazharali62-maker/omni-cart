import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canTransition, type OrderState } from "@/lib/orders/state-machine";
import { apiError } from "@/lib/api-error";
import { sendEmailNotification } from "@/lib/notifications/email";

// Admin manual actions (spec section 32): retry / cancel / refund.
// Every action is permission-checked, state-machine-checked, and audit-logged.
const ACTION_ROLES: Record<string, string[]> = {
  retry: ["ADMIN", "OPERATIONS", "FULFILLMENT_MANAGER"],
  cancel: ["ADMIN", "STORE_MANAGER", "SUPPORT"],
  refund: ["ADMIN"]
};

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role as string | undefined;
    if (!role) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { action } = await req.json();
    if (!ACTION_ROLES[action]?.includes(role)) {
      return NextResponse.json({ error: "Forbidden for your role" }, { status: 403 });
    }

    const order = await db.order.findUnique({ where: { id: params.id } });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    let to: OrderState;
    if (action === "retry") to = "PENDING";
    else if (action === "cancel") to = "CANCELLED";
    else if (action === "refund") to = "REFUNDED";
    else return NextResponse.json({ error: "Unknown action" }, { status: 400 });

    if (!canTransition(order.status as OrderState, to)) {
      return NextResponse.json({ error: `Cannot ${action} an order in ${order.status}` }, { status: 409 });
    }

    await db.order.update({ where: { id: order.id }, data: { status: to } });
    await db.auditLog.create({
      data: {
        userId: (session!.user as any).id,
        orderId: order.id,
        action: `admin.${action}`
      }
    });

    if (to === "CANCELLED") await sendEmailNotification("cancellation", order.user?.email ?? order.guestEmail ?? "", { orderId: order.id });
    if (to === "REFUNDED") await sendEmailNotification("refund", order.user?.email ?? order.guestEmail ?? "", { orderId: order.id });
    // TODO refund: call Stripe refund API before transitioning.

    return NextResponse.json({ ok: true, status: to });
  } catch (err) {
    return apiError(err);
  }
}
