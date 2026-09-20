// Lightweight order fraud heuristics (spec section 17): flags for review, never auto-block.
export type OrderSignals = {
  itemsCount: number;
  totalCents: number;
  hoursSinceSignup: number | null; // null = guest
  distinctCountriesInDay: number;
  isGuest: boolean;
  quantityPerItem: number;
};

export type FraudVerdict = { score: number; flags: string[]; action: "allow" | "review" | "hold" };

export function fraudCheck(s: OrderSignals): FraudVerdict {
  let score = 0;
  const flags: string[] = [];

  if (s.totalCents > 50_000) { score += 25; flags.push("high-value order"); }
  if (s.isGuest) { score += 15; flags.push("guest checkout"); }
  if (s.hoursSinceSignup !== null && s.hoursSinceSignup < 1) { score += 20; flags.push("brand-new account"); }
  if (s.distinctCountriesInDay >= 3) { score += 20; flags.push("multi-country activity"); }
  if (s.quantityPerItem >= 10) { score += 20; flags.push("bulk quantity per item"); }
  if (s.hoursSinceSignup !== null && s.hoursSinceSignup < 1 && s.totalCents > 40_000) {
    score += 20; flags.push("brand-new account with a large order");
  }

  score = Math.min(100, score);
  const action: FraudVerdict["action"] = score >= 60 ? "hold" : score >= 30 ? "review" : "allow";
  return { score, flags, action };
}
