import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { canTransition, type OrderState } from "@/lib/orders/state-machine";
import { sendEmailNotification } from "@/lib/notifications/email";

// Stripe webhook (spec section 6/29). Signature-verified + idempotent via
// WebhookEvent.externalId; drives the order state machine and notifications.
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" })
  : null;

async function transitionOrder(orderId: string, to: OrderState) {
  const order = await db.order.findUnique({ include: { user: { select: { email: true } } }, where: { id: orderId } });
  if (!order || !canTransition(order.status as OrderState, to)) return false;
  await db.order.update({ where: { id: orderId }, data: { status: to } });
  await db.auditLog.create({
    data: { orderId, action: `order.transitioned.${to}` }
  });
  return true;
}

export async function POST(req: NextRequest) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig!, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const existing = await db.webhookEvent.findUnique({ where: { externalId: event.id } });
  if (existing) return NextResponse.json({ ok: true, duplicate: true });

  await db.webhookEvent.create({
    data: { source: "stripe", eventType: event.type, externalId: event.id, payload: event as unknown as object }
  });

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await transitionOrder(orderId, "PAID");
      await db.payment.update({
        where: { orderId },
        data: { status: "succeeded", providerRefId: session.payment_intent as string | undefined ?? null }
      }).catch(() => {}); // payment row may not exist in test/dev flows
      const order = await db.order.findUnique({ include: { user: { select: { email: true } } }, where: { id: orderId } });
      await sendEmailNotification("payment_successful", order?.user?.email ?? order?.guestEmail ?? "", { orderId });
      // Fulfillment kickoff happens in the background job (src/lib/orders/fulfillment.ts).
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) await transitionOrder(orderId, "FAILED");
  }

  return NextResponse.json({ ok: true });
}
