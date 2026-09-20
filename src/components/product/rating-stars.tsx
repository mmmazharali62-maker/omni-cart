// Star rating display (spec section 3): fractions render as full/half/empty.
export function RatingStars({ rating, count }: { rating: number; count?: number }) {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <span className="inline-flex items-center gap-1" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= rounded ? "text-amber-400" : i - 0.5 === rounded ? "text-amber-400/50" : "text-white/20"}>
          ★
        </span>
      ))}
      {count !== undefined && <span className="text-xs text-white/50">({count})</span>}
    </span>
  );
}
