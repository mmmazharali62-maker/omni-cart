import { db } from "@/lib/db";
import { GlassPanel } from "@/components/ui/glass-panel";
import { formatMoney } from "@/lib/utils";
import { notFound } from "next/navigation";
import { RecentlyViewedTracker } from "@/components/product/recently-viewed";
import { WishlistButton } from "@/components/product/wishlist-button";
import { BuyPanel } from "@/components/product/buy-panel";
import { ImageGallery } from "@/components/product/image-gallery";
import { RelatedProducts } from "@/components/product/related-products";
import { ReviewForm } from "@/components/product/review-form";

// Product detail page (spec section 3): gallery, variant-aware buy panel,
// moderated reviews, related products, and schema.org structured data.
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await db.product
    .findUnique({
      where: { slug: params.slug },
      include: { variants: true, reviews: true, category: true, supplierLinks: { include: { supplier: true } } }
    })
    .catch(() => null);

  if (!product) notFound();

  // Only moderated, non-hidden reviews are shown publicly (spec section 20).
  const publicReviews = product.reviews.filter((r) => r.isModerated && !r.isHidden);

  const price = product.salePrice ? Number(product.salePrice) : Number(product.basePrice);
  const avgRating =
    publicReviews.length > 0
      ? publicReviews.reduce((s, r) => s + r.rating, 0) / publicReviews.length
      : null;
  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);

  return (
    <>
      <RecentlyViewedTracker productId={product.id} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            description: product.description,
            image: product.images.slice(0, 3),
            sku: product.variants[0]?.sku,
            offers: {
              "@type": "Offer",
              price,
              priceCurrency: product.currency,
              availability: totalStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
            },
            ...(avgRating != null
              ? {
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: avgRating.toFixed(1),
                    reviewCount: publicReviews.length
                  }
                }
              : {})
          })
        }}
      />

      <section className="mx-4 mt-8 grid md:grid-cols-2 gap-8">
        <GlassPanel className="overflow-hidden p-0">
          <ImageGallery images={product.images} alt={product.title} />
        </GlassPanel>

        <div className="flex flex-col gap-4">
          <GlassPanel>
            <h1 className="text-2xl font-semibold">{product.title}</h1>
            <div className="mt-2 flex items-center gap-3 text-sm text-white/70">
              {avgRating != null ? (
                <span>{"★".repeat(Math.round(avgRating))} {avgRating.toFixed(1)} ({publicReviews.length} reviews)</span>
              ) : (
                <span>No reviews yet</span>
              )}
              {product.category && <span>· {product.category.name}</span>}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-3xl font-semibold">{formatMoney(price, product.currency)}</span>
              {product.salePrice && (
                <span className="text-white/40 line-through">{formatMoney(Number(product.basePrice), product.currency)}</span>
              )}
            </div>
            <p className="mt-2 text-sm text-white/60">
              {totalStock > 5
                ? "In stock · Free shipping over $50"
                : totalStock > 0
                  ? `Only ${totalStock} left in stock`
                  : "Out of stock"}
            </p>
            <BuyPanel
              variants={product.variants.map((v) => ({
                id: v.id,
                options: (v.options ?? {}) as Record<string, string>,
                price: Number(v.price),
                stock: v.stock
              }))}
              outOfStock={totalStock === 0}
            />
            <div className="mt-4">
              <WishlistButton productId={product.id} />
            </div>
          </GlassPanel>

          {product.variants.length > 0 && (
            <GlassPanel>
              <p className="text-sm font-medium mb-3">All Options</p>
              <ul className="text-sm text-white/70 space-y-1">
                {product.variants.map((v) => (
                  <li key={v.id}>
                    {Object.entries((v.options ?? {}) as Record<string, string>)
                      .map(([k, val]) => `${k}: ${val}`)
                      .join(" · ")}{" "}
                    — {formatMoney(Number(v.price), product.currency)} ({v.stock} in stock)
                  </li>
                ))}
              </ul>
            </GlassPanel>
          )}
        </div>
      </section>

      <section className="mx-4 mt-8">
        <GlassPanel>
          <h2 className="text-lg font-semibold">Description</h2>
          <p className="mt-3 text-white/70 leading-relaxed whitespace-pre-wrap">{product.description}</p>
        </GlassPanel>
      </section>

      <section className="mx-4 mt-8">
        <GlassPanel>
          <h2 className="text-lg font-semibold mb-4">
            Reviews{" "}
            <span className="float-right">
              <ReviewForm productId={product.id} />
            </span>
          </h2>
          {publicReviews.length === 0 ? (
            <p className="text-white/50 text-sm">No reviews yet.</p>
          ) : (
            <ul className="space-y-4">
              {publicReviews.map((r) => (
                <li key={r.id} className="border-b border-white/10 pb-4 last:border-0">
                  <p className="text-sm">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
                  {r.title && <p className="font-medium mt-1">{r.title}</p>}
                  {r.body && <p className="text-white/70 text-sm mt-1">{r.body}</p>}
                  {r.isVerifiedPurchase && <p className="text-xs text-emerald-400 mt-1">Verified purchase</p>}
                </li>
              ))}
            </ul>
          )}
        </GlassPanel>
      </section>

      <RelatedProducts productId={product.id} categoryId={product.categoryId} />
    </>
  );
}
