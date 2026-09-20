import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import Stripe from "stripe";

// Checkout (spec section 5): creates a Pending Order, then a Stripe Checkout
// Session / PaymentIntent server-side. Stripe secret key is read from env only.
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" })
  : null;

export async function POST(req: NextRequest) {
  const body = await req.json();
  // TODO: validate body with zod (items, shippingAddress, billingAddress, couponCode),
  // recompute subtotal/discount/shipping/tax server-side (never trust client totals),
  // create Order (status PENDING) + OrderItems.

  if (!stripe) {
    return NextResponse.json({ error: "Payments are not configured yet." }, { status: 503 });
  }

  // TODO: const session = await stripe.checkout.sessions.create({ ... amount from server-computed total ... });
  return NextResponse.json({ ok: true, received: body });
}
