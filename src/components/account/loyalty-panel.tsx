import { GlassPanel } from "@/components/ui/glass-panel";
import { pointsToNextTier, TIER_PERKS, tierForLifetimePoints, type Tier } from "@/lib/loyalty";

// Account loyalty panel (spec section 15/6).
export function LoyaltyPanel({ points }: { points: number }) {
  const tier = tierForLifetimePoints(points);
  const next = pointsToNextTier(points);

  return (
    <GlassPanel className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-white/50">Your status</p>
          <p className="text-2xl font-semibold capitalize">{tier}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-white/50">Lifetime points</p>
          <p className="text-2xl font-semibold">{points}</p>
        </div>
      </div>
      {next && (
        <p className="text-xs text-white/40 mt-3">
          {next.needed} points to {next.tier} - that's about ${next.needed} in orders.
        </p>
      )}
      <ul className="text-sm text-white/70 mt-4 space-y-1">
        {TIER_PERKS[tier as Tier].map((p) => (
          <li key={p}>- {p}</li>
        ))}
      </ul>
    </GlassPanel>
  );
}
