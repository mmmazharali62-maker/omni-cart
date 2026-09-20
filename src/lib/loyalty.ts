// Simple loyalty program math (spec section 15): 1 point per $1, tier badges.
export type Tier = "bronze" | "silver" | "gold" | "platinum";

export function pointsForOrder(totalUsd: number): number {
  return Math.max(0, Math.floor(totalUsd));
}

export function tierForLifetimePoints(points: number): Tier {
  if (points >= 2500) return "platinum";
  if (points >= 1000) return "gold";
  if (points >= 250) return "silver";
  return "bronze";
}

export const TIER_PERKS: Record<Tier, string[]> = {
  bronze: ["Order tracking"],
  silver: ["Order tracking", "5% birthday discount"],
  gold: ["Order tracking", "5% birthday discount", "Free returns"],
  platinum: ["Priority support", "Free express shipping", "Free returns", "Early access to deals"]
};

// Points needed to reach the next tier (null when at platinum).
export function pointsToNextTier(points: number): { tier: Tier; needed: number } | null {
  const thresholds: Array<[Tier, number]> = [["silver", 250], ["gold", 1000], ["platinum", 2500]];
  for (const [tier, min] of thresholds) {
    if (points < min) return { tier, needed: min - points };
  }
  return null;
}
