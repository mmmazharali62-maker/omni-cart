import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiError } from "@/lib/api-error";
import { formatBalance, normalizeCode } from "@/lib/gift-cards";

const schema = z.object({ code: z.string().min(8).max(40) });

// Public balance check - reveals only the formatted balance, never the buyer.
export async function POST(req: NextRequest) {
  try {
    const { code } = schema.parse(await req.json());
    const card = await db.giftCard.findUnique({ where: { code: normalizeCode(code) } }).catch(() => null);
    if (!card || !card.isActive) return NextResponse.json({ error: "Gift card not found" }, { status: 404 });
    if (card.expiresAt && card.expiresAt < new Date()) {
      return NextResponse.json({ error: "This gift card has expired." }, { status: 400 });
    }
    return NextResponse.json({ balance: formatBalance(card.remainingCents, card.currency) });
  } catch (err) {
    return apiError(err);
  }
}
