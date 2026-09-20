import { RatingStars } from "./rating-stars";
import { EmptyState } from "@/components/ui/empty-state";

export type ReviewItem = {
  id: string;
  rating: number;
  title?: string | null;
  content: string;
  createdAt: string | Date;
  authorName: string;
  verified: boolean;
};

// Review list with verified badges (spec section 3).
export function ReviewList({ reviews }: { reviews: ReviewItem[] }) {
  if (reviews.length === 0) {
    return <EmptyState title="No reviews yet" message="Be the first to review this product." />;
  }
  return (
    <ul className="space-y-4">
      {reviews.map((r) => (
        <li key={r.id} className="glass p-4">
          <div className="flex items-center justify-between gap-2">
            <RatingStars rating={r.rating} />
            {r.verified && (
              <span className="text-xs text-emerald-400">✓ Verified purchase</span>
            )}
          </div>
          {r.title && <p className="font-medium mt-2">{r.title}</p>}
          <p className="text-sm text-white/70 mt-1">{r.content}</p>
          <p className="text-xs text-white/40 mt-2">
            {r.authorName} - {new Date(r.createdAt).toLocaleDateString()}
          </p>
        </li>
      ))}
    </ul>
  );
}
