import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiError } from "@/lib/api-error";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateReferralCode, referralEligible, REWARD_CENTS } from "@/lib/referrals";

// Referral program (spec section 15): issue codes + mark rewards.
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions).catch(() => null);
    const userId = (session?.user as { id?: string })?.id;
    if (!userId) return NextResponse.json({ error: "Sign in to get your referral code" }, { status: 401 });

    const body = z.object({ refereeEmail: z.string().email().optional() }).parse(await req.json().catch(() => ({})));

    const existing = await db.referral.findFirst({ where: { referrerId: userId } });
    const referral = existing ?? await db.referral.create({
      data: { code: generateReferralCode(), referrerId: userId, rewardCents: REWARD_CENTS, refereeEmail: body.refereeEmail }
    });
    return NextResponse.json({ code: referral.code, status: referral.status, rewardCents: referral.rewardCents });
  } catch (err) {
    return apiError(err);
  }
}
