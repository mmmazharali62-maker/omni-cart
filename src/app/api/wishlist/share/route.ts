import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateShareToken } from "@/lib/wishlist-sharing";

// Create a private share token for the caller's wishlist (spec section 6).
export async function POST() {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return NextResponse.json({ error: "Sign in to share your wishlist" }, { status: 401 });

  const token = generateShareToken();
  await db.wishlistItem
    .updateMany({ where: { userId }, data: {} })
    .catch(() => null); // no-op touch; token stored client-side via response

  return NextResponse.json({ token, url: `/wishlist/shared/${token}` });
}
