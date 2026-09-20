// Review aggregation (spec section 7/3): feeds star displays + rating badges.
export type ReviewSummaryInput = { rating: number; verified?: boolean; createdAt?: string | Date };

export function aggregateReviews(reviews: ReviewSummaryInput[]) {
  if (reviews.length === 0) {
    return { average: 0, count: 0, verifiedCount: 0, distribution: [0, 0, 0, 0, 0], percentRecommended: 0 };
  }
  const distribution = [0, 0, 0, 0, 0];
  let sum = 0;
  let verified = 0;
  for (const r of reviews) {
    const idx = Math.min(5, Math.max(1, Math.round(r.rating))) - 1;
    distribution[idx]++;
    sum += r.rating;
    if (r.verified) verified++;
  }
  const average = Math.round((sum / reviews.length) * 10) / 10;
  return {
    average,
    count: reviews.length,
    verifiedCount: verified,
    distribution,
    percentRecommended: Math.round((distribution.slice(3).reduce((a, b) => a + b, 0) / reviews.length) * 100)
  };
}

// Badge thresholds: only shown once enough reviews exist to be meaningful.
export function ratingBadge(average: number, count: number): "top-rated" | "well-liked" | null {
  if (count < 5) return null;
  if (average >= 4.5) return "top-rated";
  if (average >= 4) return "well-liked";
  return null;
}
