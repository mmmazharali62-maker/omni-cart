import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Customer-facing tracking view for an order (spec section 12).
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const shipments = await db.shipment.findMany({
    where: { orderId: params.id },
    include: { events: { orderBy: { occurredAt: "desc" } } }
  });
  return NextResponse.json({ shipments });
}
