import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiError } from "@/lib/api-error";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateGiftCardCode, normalizeCode, redemptionPlan } from "@/lib/gift-cards";

const schema = z.object({
  action: z.enum(["purchase", "redeem"]),
  amount: z.number().int().min(5).max(500).optional(), // purchase
  email: z.string().email().optional(),               // purchase recipient
  code: z.string().max(40).optional(),               // redeem
  chargeCents: z.number().int().min(0).optional()     // redeem against a checkout
});

// Purchase a gift card (paid like any product) or check redemption at checkout.
export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json());

    if (body.action === "purchase") {
      if (!body.amount || !body.email) return NextResponse.json({ error: "amount and email are required" }, { status: 400 });
      const session = await getServerSession(authOptions).catch(() => null);
      const card = await db.giftCard.create({
        data: {
          code: generateGiftCardCode(),
          initialCents: body.amount * 100,
          remainingCents: body.amount * 100,
          purchasedByUserId: (session?.user as { id?: string })?.id ?? null,
          note: `Gift for ${body.email}`
        }
      });
      return NextResponse.json({ code: card.code, balance: card.remainingCents }, { status: 201 });
    }

    // redeem: validate a code against a charge.
    if (!body.code || body.chargeCents === undefined) {
      return NextResponse.json({ error: "code and chargeCents are required" }, { status: 400 });
    }
    const card = await db.giftCard.findUnique({ where: { code: normalizeCode(body.code) } }).catch(() => null);
    if (!card) return NextResponse.json({ error: "Gift card not found" }, { status: 404 });

    const plan = redemptionPlan(
      { code: card.code, initialCents: card.initialCents, remainingCents: card.remainingCents, isActive: card.isActive, expiresAt: card.expiresAt },
      body.chargeCents
    );
    if ("error" in plan) return NextResponse.json({ error: plan.error }, { status: 400 });
    return NextResponse.json(plan);
  } catch (err) {
    return apiError(err);
  }
}
