import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { LoyaltyPanel } from "@/components/account/loyalty-panel";
import { ReferralCard } from "@/components/referral/referral-card";
import { GlassPanel } from "@/components/ui/glass-panel";
import { pageMeta } from "@/lib/seo-meta";
import { generateReferralCode } from "@/lib/referrals";

export const metadata = pageMeta("Rewards", "Loyalty points, tiers, and referral rewards at Omni Cart.");

// Rewards hub (spec section 15): loyalty + referrals in one place.
export default async function RewardsPage() {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string })?.id;

  const referral = userId
    ? await db.referral.findFirst({ where: { referrerId: userId } }).catch(() => null)
    : null;
  const code = referral?.code ?? generateReferralCode(() => 0.42); // placeholder until first claim

  const points = userId
    ? await db.order.aggregate({
        where: { userId, status: { in: ["DELIVERED"] } },
        _sum: { grandTotal: true }
      }).then((r) => Math.floor(Number(r._sum.grandTotal ?? 0))).catch(() => 0)
    : 0;

  return (
    <section className="mx-4 mt-12 max-w-3xl">
      <h1 className="text-3xl font-semibold">Rewards</h1>
      <p className="text-white/50 text-sm mt-1 mb-6">Earn 1 point per $1. Points unlock tiers; referrals earn $5 both ways.</p>
      <div className="grid md:grid-cols-2 gap-4">
        {userId ? (
          <LoyaltyPanel points={points} />
        ) : (
          <GlassPanel className="p-5 text-sm text-white/60">Sign in to see your points and tier progress.</GlassPanel>
        )}
        {userId ? (
          <ReferralCard code={code} />
        ) : (
          <GlassPanel className="p-5 text-sm text-white/60">Sign in to get your referral code and start earning $5 per friend.</GlassPanel>
        )}
      </div>
    </section>
  );
}
