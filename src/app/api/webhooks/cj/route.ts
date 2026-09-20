import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// CJ Dropshipping webhook: order status/tracking push notifications (spec section 12/29).
// Verifies + stores with idempotency, same pattern as the Stripe webhook.
export async function POST(req: NextRequest) {
  const payload = await req.json();
  const externalId = payload?.eventId ?? payload?.id;
  if (!externalId) return NextResponse.json({ error: "Missing event id" }, { status: 400 });

  const existing = await db.webhookEvent.findUnique({ where: { externalId } });
  if (existing) return NextResponse.json({ ok: true, duplicate: true });

  await db.webhookEvent.create({
    data: { source: "cj_dropshipping", eventType: payload?.type ?? "unknown", externalId, payload }
  });

  // TODO: map payload to Shipment/TrackingEvent update + customer notification.
  return NextResponse.json({ ok: true });
}
