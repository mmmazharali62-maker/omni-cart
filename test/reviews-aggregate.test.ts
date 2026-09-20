import { describe, expect, it } from "vitest";
import { aggregateReviews, ratingBadge } from "@/lib/reviews-aggregate";

describe("review aggregation", () => {
  it("averages and distributes ratings", () => {
    const a = aggregateReviews([{ rating: 5 }, { rating: 5 }, { rating: 4 }, { rating: 1 }]);
    expect(a.average).toBe(3.8);
    expect(a.count).toBe(4);
    expect(a.distribution).toEqual([1, 0, 0, 1, 2]);
  });
  it("handles empty lists safely", () => {
    expect(aggregateReviews([]).average).toBe(0);
  });
  it("counts verified buyers and recommendations", () => {
    const a = aggregateReviews([{ rating: 5, verified: true }, { rating: 4, verified: true }, { rating: 2 }]);
    expect(a.verifiedCount).toBe(2);
    expect(a.percentRecommended).toBe(67);
  });
  it("only shows badges with enough reviews", () => {
    expect(ratingBadge(4.9, 3)).toBeNull();
    expect(ratingBadge(4.9, 10)).toBe("top-rated");
    expect(ratingBadge(4.1, 10)).toBe("well-liked");
    expect(ratingBadge(3.0, 10)).toBeNull();
  });
});
