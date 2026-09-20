import { NextRequest, NextResponse } from "next/server";

// Smart Cart API (spec section 4). Cookie-based cart for guests, session-scoped
// for logged-in customers; totals always recomputed server-side via computeCartTotals.
export async function GET(_req: NextRequest) {
  // TODO: read cart from cookie/session, hydrate variant prices from DB, run computeCartTotals.
  return NextResponse.json({ items: [], subtotal: 0, discountTotal: 0, shippingTotal: 0, taxTotal: 0, grandTotal: 0 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  // TODO: validate { variantId, quantity } with zod, check stock, persist to cart storage.
  return NextResponse.json({ ok: true, received: body });
}
