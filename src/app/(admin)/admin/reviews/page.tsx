import { db } from "@/lib/db";
import { GlassPanel } from "@/components/ui/glass-panel";
import Link from "next/link";
import { ReviewModerationButtons } from "@/components/admin/review-moderation";

// Review moderation (spec section 20).
export default async function AdminReviewsPage() {
  const reviews = await db.review
    .findMany({
      where: { isModerated: false },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { user: { select: { name: true, email: true } }, product: { select: { title: true, slug: true } } }
    })
    .catch(() => []);

  return (
    <section className="max-w-3xl">
      <h1 className="text-2xl font-semibold mb-2">Review Moderation</h1>
      <p className="text-white/50 text-sm mb-6">Approve, hide, or delete customer reviews before they appear publicly.</p>
      {reviews.length === 0 ? (
        <GlassPanel><p className="text-white/50 text-sm">Queue is clear - nothing awaiting moderation.</p></GlassPanel>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <GlassPanel key={r.id}>
              <div className="flex justify-between text-sm">
                <span className="text-white/80">{r.user?.name ?? r.user?.email ?? "customer"}</span>
                <span className="text-white/50 text-xs">{r.createdAt.toDateString()}</span>
              </div>
              <p className="mt-2">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)} <span className="text-white/60 text-sm">on <Link href={`/product/${r.product.slug}`} className="text-brand-400">{r.product.title}</Link></span></p>
              {r.title && <p className="font-medium mt-2">{r.title}</p>}
              {r.body && <p className="text-white/70 text-sm mt-1">{r.body}</p>}
              {r.isVerifiedPurchase && <p className="text-xs text-emerald-400 mt-1">Verified purchase</p>}
              <div className="mt-4"><ReviewModerationButtons reviewId={r.id} /></div>
            </GlassPanel>
          ))}
        </div>
      )}
    </section>
  );
}
