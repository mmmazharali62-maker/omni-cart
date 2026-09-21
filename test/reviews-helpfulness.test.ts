import { describe, expect, it } from "vitest";
import { dedupeVotes, helpfulCounts, isMostHelpful, capVoter } from "@/lib/reviews-helpfulness";

describe("review helpfulness", () => {
  const votes = [
    { reviewId: "r1", voterKey: "u1" },
    { reviewId: "r1", voterKey: "u2" },
    { reviewId: "r1", voterKey: "u1" }, // dupe
    { reviewId: "r2", voterKey: "u1" }
  ];
  it("dedupes one vote per voter per review", () => {
    expect(dedupeVotes(votes)).toHaveLength(3);
    expect(helpfulCounts(votes).r1).toBe(2);
  });
  it("tags most-helpful at 3+ votes", () => {
    expect(isMostHelpful("r1", votes)).toBe(false);
    expect(isMostHelpful("r1", [...votes, { reviewId: "r1", voterKey: "u3" }])).toBe(true);
  });
  it("caps prolific voters", () => {
    const many = Array.from({ length: 30 }, (_, i) => ({ reviewId: `r${i}`, voterKey: "bot" }));
    expect(capVoter(many, "bot")).toHaveLength(20);
  });
});
