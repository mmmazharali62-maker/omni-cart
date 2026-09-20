import { GlassPanel } from "@/components/ui/glass-panel";
import { RatingStars } from "@/components/product/rating-stars";

export type Testimonial = { id: string; author: string; market: "US" | "GB"; rating: number; quote: string };

// Social proof row (spec section 1): real-style quotes from both markets.
export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null;
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {testimonials.map((t) => (
        <GlassPanel key={t.id} className="p-5">
          <RatingStars rating={t.rating} />
          <p className="text-sm text-white/70 mt-3">&ldquo;{t.quote}&rdquo;</p>
          <p className="text-xs text-white/40 mt-3">
            {t.author} - {t.market === "GB" ? "United Kingdom" : "United States"} - verified buyer
          </p>
        </GlassPanel>
      ))}
    </div>
  );
}
