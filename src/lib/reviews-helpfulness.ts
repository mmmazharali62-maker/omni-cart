// Review helpfulness votes (spec section 7): ranking + abuse limits.
export type HelpfulVote = { reviewId: string; voterKey: string };

// One vote per voter per review - dedupe server-side.
export function dedupeVotes(votes: HelpfulVote[]): HelpfulVote[] {
  const seen = new Set<string>();
  const out: HelpfulVote[] = [];
  for (const v of votes) {
    const k = `${v.reviewId}:${v.voterKey}`;
    if (!seen.has(k)) { seen.add(k); out.push(v); }
  }
  return out;
}

export function helpfulCounts(votes: HelpfulVote[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const v of dedupeVotes(votes)) counts[v.reviewId] = (counts[v.reviewId] ?? 0) + 1;
  return counts;
}

// Reviews with >= 3 helpful votes get the "Most helpful" tag.
export function isMostHelpful(reviewId: string, votes: HelpfulVote[]): boolean {
  return (helpfulCounts(votes)[reviewId] ?? 0) >= 3;
}

// A single voter casting 20+ votes in a day is gaming - ignore their excess.
export const VOTER_DAILY_CAP = 20;
export function capVoter(votes: HelpfulVote[], voterKey: string): HelpfulVote[] {
  const mine = votes.filter((v) => v.voterKey === voterKey);
  return mine.slice(0, VOTER_DAILY_CAP);
}
