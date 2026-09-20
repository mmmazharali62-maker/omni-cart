import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import Stripe from "stripe";
import { checkoutSchema } from "@/lib/validation";
import { computeCartTotals } from "@/lib/cart/totals";
import { validateCoupon } from "@/lib/coupons/validate";
import { apiError } from "@/lib/api-error";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmailNotification } from "@/lib/notifications/email";

// Checkout (spec section 5): server-side validation, server-recomputed totals,
// PENDING order + Stripe Checkout Session. Client totals are never trusted.
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" })
  : null;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = checkoutSchema.parse(body);

    // Rehydrate every line from DB - client prices are ignored entirely.
    const variantIds = input.items.map((i) => i.variantId);
    const variants = await db.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: { select: { id: true, title: true, status: true, supplierLinks: { select: { supplierId: true } } } }, inventory: true }
    });
    const byId = new Map(variants.map((v) => [v.id, v]));

    const lines = [];
    for (const item of input.items) {
      const v = byId.get(item.variantId);
      if (!v || v.product.status !== "active") {
        return NextResponse.json({ error: `Variant ${item.variantId} is no longer available` }, { status: 409 });
      }
      const qty = Math.min(item.quantity, v.stock);
      if (qty < item.quantity) {
        return NextResponse.json({ error: `Only ${v.stock} left of ${v.product.title}` }, { status: 409 });
      }
      lines.push({
        variantId: v.id,
        productId: v.product.id,
        supplierId: v.product.supplierLinks[0]?.supplierId ?? null,
        title: v.product.title,
        sku: v.sku,
        quantity: qty,
        unitPrice: v.price.toNumber()
      });
    }

    // Coupon (optional).
    let coupon = undefined;
    if (input.couponCode) {
      const provisional = computeCartTotals({ lines });
      const result = await validateCoupon(input.couponCode, provisional.subtotal);
      if (!result.ok) {
        return NextResponse.json({ error: `Coupon ${result.reason.replace(/_/g, " ")}` }, { status: 400 });
      }
      coupon = {
        type: result.coupon.type as "percentage" | "fixed" | "free_shipping",
        value: result.coupon.value?.toNumber(),
        minOrderAmount: result.coupon.minOrderAmount?.toNumber()
      };
    }

    // US shipping/tax defaults; UK handled when store config exists (TODO: per-region rates).
    const isUS = input.shippingAddress.country === "US";
    const totals = computeCartTotals({
      lines,
      coupon,
      shippingBaseRate: input.shippingMethod === "express" ? 14.99 : 5.99,
      taxRate: isUS ? 0.07 : 0.2 // TODO: real per-state VAT/sales-tax tables
    });

    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id ?? null;

    const order = await db.order.create({
      data: {
        userId,
        guestEmail: userId ? null : input.email,
        status: "PENDING",
        subtotal: totals.subtotal,
        discountTotal: totals.discountTotal,
        shippingTotal: totals.shippingTotal,
        taxTotal: totals.taxTotal,
        grandTotal: totals.grandTotal,
        shippingAddress: input.shippingAddress,
        billingAddress: input.billingAddress ?? input.shippingAddress,
        couponCode: input.couponCode?.toUpperCase(),
        items: {
          create: lines.map((l) => ({
            productId: l.productId,
            variantId: l.variantId,
            title: l.title,
            sku: l.sku,
            quantity: l.quantity,
            unitPrice: l.unitPrice,
            supplierId: l.supplierId
          }))
        },
        payment: { create: { status: "pending", amount: totals.grandTotal } }
      }
    });

    if (!stripe) {
      // Dev mode without Stripe: return order so the flow can be tested locally.
      return NextResponse.json({ orderId: order.id, stripeConfigured: false, totals });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: input.email,
      line_items: lines.map((l) => ({
        price_data: {
          currency: "usd",
          product_data: { name: l.title },
          unit_amount: Math.round(l.unitPrice * 100)
        },
        quantity: l.quantity
      })),
      metadata: { orderId: order.id },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/checkout/success?order=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/cart`
    });

    await sendEmailNotification("order_received", input.email, { orderId: order.id });
    return NextResponse.json({ orderId: order.id, checkoutUrl: checkoutSession.url, totals });
  } catch (err) {
    return apiError(err);
  }
}
