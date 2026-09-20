import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { readGuestCart, writeGuestCart } from "@/lib/cart/guest-cart";
import { computeCartTotals } from "@/lib/cart/totals";
import { addToCartSchema } from "@/lib/validation";
import { apiError } from "@/lib/api-error";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { z } from "zod";

// Smart Cart API (spec section 4): guest cookie cart; totals recomputed from DB.
const modifySchema = addToCartSchema.extend({ replace: z.boolean().optional() });

export async function GET(req: NextRequest) {
  try {
    const cart = readGuestCart(req);
    const hydrated = await hydrate(cart);
    return NextResponse.json(hydrated);
  } catch (err) {
    return apiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const rl = rateLimit(clientKey(req, "cart"), 120, 60_000);
    if (!rl.allowed) return NextResponse.json({ error: "Slow down a bit" }, { status: 429 });

    const body = await req.json();
    const { variantId, quantity, replace } = modifySchema.parse(body);

    const variant = await db.productVariant.findUnique({ where: { id: variantId }, include: { product: true } });
    if (!variant || variant.product.status !== "active") {
      return NextResponse.json({ error: "Product unavailable" }, { status: 404 });
    }

    const cart = readGuestCart(req);
    const existing = cart.lines.find((l) => l.variantId === variantId);
    const newQty = existing
      ? Math.min(99, replace ? quantity : existing.quantity + quantity)
      : quantity;

    if (variant.stock < newQty) {
      return NextResponse.json({ error: `Only ${variant.stock} in stock` }, { status: 409 });
    }

    if (existing) existing.quantity = newQty;
    else cart.lines.push({ variantId, quantity });

    const hydrated = await hydrate(cart);
    return writeGuestCart(cart, NextResponse.json(hydrated));
  } catch (err) {
    return apiError(err);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { variantId } = await req.json();
    const cart = readGuestCart(req);
    cart.lines = cart.lines.filter((l) => l.variantId !== variantId);
    const hydrated = await hydrate(cart);
    return writeGuestCart(cart, NextResponse.json(hydrated));
  } catch (err) {
    return apiError(err);
  }
}

async function hydrate(cart: { lines: Array<{ variantId: string; quantity: number }> }) {
  if (cart.lines.length === 0) {
    return { items: [], subtotal: 0, discountTotal: 0, shippingTotal: 0, taxTotal: 0, grandTotal: 0, freeShippingRemaining: 50 };
  }
  const variants = await db.productVariant.findMany({
    where: { id: { in: cart.lines.map((l) => l.variantId) } },
    include: { product: { select: { id: true, title: true, slug: true, currency: true } } }
  });
  const byId = new Map(variants.map((v) => [v.id, v]));
  const items = cart.lines
    .filter((l) => byId.has(l.variantId))
    .map((l) => {
      const v = byId.get(l.variantId)!;
      return {
        variantId: l.variantId,
        productId: v.product.id,
        title: v.product.title,
        slug: v.product.slug,
        sku: v.sku,
        unitPrice: v.price.toNumber(),
        quantity: Math.min(l.quantity, Math.max(1, v.stock))
      };
    });
  const totals = computeCartTotals({ lines: items.map(({ unitPrice, quantity }) => ({ unitPrice, quantity })) });
  return { items, ...totals };
}
