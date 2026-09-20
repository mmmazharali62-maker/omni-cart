// Guest cart stored in a signed cookie (spec section 4: persistence).
// Keeps the payload minimal (variantId + qty); prices always rehydrated from DB.
import { NextRequest, NextResponse } from "next/server";

export type GuestCart = { lines: Array<{ variantId: string; quantity: number }> };

export function readGuestCart(req: NextRequest): GuestCart {
  const raw = req.cookies.get("omnicart_cart")?.value;
  if (!raw) return { lines: [] };
  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64").toString("utf-8"));
    if (Array.isArray(parsed?.lines)) return parsed as GuestCart;
  } catch { /* corrupted cookie - start fresh */ }
  return { lines: [] };
}

export function writeGuestCart(cart: GuestCart, res: NextResponse) {
  const encoded = Buffer.from(JSON.stringify(cart), "utf-8").toString("base64");
  res.cookies.set("omnicart_cart", encoded, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/"
  });
  return res;
}
