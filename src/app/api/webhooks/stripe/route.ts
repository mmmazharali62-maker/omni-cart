import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";

// Stripe webhook (spec section 6/29). Verifies signature and is idempotent via
// WebhookEvent.externalId (Stripe event id) before ever mutating an Order.
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" })
  : null;

export async function POST(req: NextRequest) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig!, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const existing = await db.webhookEvent.findUnique({ where: { externalId: event.id } });
  if (existing) return NextResponse.json({ ok: true, duplicate: true });

  await db.webhookEvent.create({
    data: { source: "stripe", eventType: event.type, externalId: event.id, payload: event as unknown as object }
  });

  // TODO: switch on event.type (checkout.session.completed, payment_intent.payment_failed, charge.refunded, ...)
  // and update Order/Payment status accordingly, then trigger notifications + fulfillment kickoff.

  return NextResponse.json({ ok: true });
}
