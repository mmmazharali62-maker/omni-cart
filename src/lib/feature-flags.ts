// Feature flags (spec section 26): kill switches and gradual rollouts.
export type Flag = {
  key: string; description: string;
  enabled: boolean;
  rolloutPct: number; // 0-100
  audience: "all" | "staff" | "beta";
};

export const DEFAULT_FLAGS: Flag[] = [
  { key: "compare-mode", description: "Product comparison tray", enabled: true, rolloutPct: 100, audience: "all" },
  { key: "referrals", description: "Referral program", enabled: true, rolloutPct: 100, audience: "all" },
  { key: "bundles", description: "Buy-together bundles", enabled: true, rolloutPct: 50, audience: "beta" },
  { key: "new-checkout", description: "One-page checkout rewrite", enabled: false, rolloutPct: 0, audience: "staff" }
];

export function isEnabled(flags: Flag[], key: string, pctSlot = 100): boolean {
  const flag = flags.find((f) => f.key === key);
  if (!flag || !flag.enabled) return false;
  if (flag.audience === "staff") return false; // staff-only via env override, not public
  return pctSlot <= flag.rolloutPct;
}

// Deterministic slot from a visitor id: same visitor, same experience.
export function rolloutSlot(visitorId: string): number {
  let h = 0;
  for (let i = 0; i < visitorId.length; i++) h = ((h * 31) + visitorId.charCodeAt(i)) >>> 0;
  return h % 100 + 1; // 1..100
}
