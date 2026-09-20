import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { detectCarrier, trackingUrl } from "@/lib/shipping/carriers";

// Public tracking lookup (spec section 19): shipment + events by tracking number.
export async function GET(_req: NextRequest, { params }: { params: { number: string } }) {
  const number = params.number.trim();
  if (number.length < 6 || number.length > 40) {
    return NextResponse.json({ error: "Invalid tracking number" }, { status: 400 });
  }

  const shipment = await db.shipment.findFirst({
    where: { trackingNumber: number },
    include: { events: { orderBy: { occurredAt: "desc" }, take: 20 } }
  }).catch(() => null);

  const carrier = shipment?.carrier ?? detectCarrier(number);

  return NextResponse.json({
    found: !!shipment,
    carrier,
    carrierUrl: trackingUrl(carrier, number),
    shipment: shipment
      ? {
          status: shipment.status,
          orderId: shipment.orderId.slice(0, 8),
          events: shipment.events.map((e) => ({
            status: e.status,
            location: e.location,
            occurredAt: e.occurredAt
          }))
        }
      : null
  });
}
