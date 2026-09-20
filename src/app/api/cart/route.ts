import { NextRequest, NextResponse } from "next/server";

// Smart Cart API (spec section 4). Cart persistence strategy TBD (server-side
// Cart model vs. signed cookie) - stubbed as cookie-based for guests for now.
export async function GET(_req: NextRequest) {
  // TODO: read cart from cookie/session, hydrate product/variant data, compute totals.
  return NextResponse.json({ items: [], subtotal: 0, discountTotal: 0, shippingTotal: 0, taxTotal: 0, grandTotal: 0 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  // TODO: add/update item { variantId, quantity } in cart storage.
  return NextResponse.json({ ok: true, received: body });
}
