import Image from "next/image";
import { db } from "@/lib/db";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";
import { FeaturedProductsSection } from "@/components/home/featured-products";
import { formatMoney } from "@/lib/utils";
import { notFound } from "next/navigation";
import { RecentlyViewedTracker } from "@/components/product/recently-viewed";
import { WishlistButton } from "@/components/product/wishlist-button";
import { BuyPanel } from "@/components/product/buy-panel";
import { ImageGallery } from "@/components/product/image-gallery";
import { RelatedProducts } from "@/components/product/related-products";
import { ReviewForm } from "@/components/product/review-form";

// Product detail page (spec section 3).
export default async function ProductPage({ params }: { params: { slug: string } }) {
  const [product, publicReviews] = await Promise.all([
    db.product

    .findUnique({
      where: { slug: params.slug },
      .findUnique({
      where: { slug: slug },
      include: { variants: true, reviews: true, category: true, supplierLinks: { include: { supplier: true } } }
    }).catch(() => null),
    db.review
      .findMany({ where: { productId: undefined, isModerated: true, isHidden: false } })
      .catch(() => [])
  ]);
  if (!product) notFound();
    })
    .catch(() => null);

  if (!product) notFound();

  const price = product.salePrice ? Number(product.salePrice) : Number(product.basePrice);
  const related = await db.product
    .findMany({
      where: { categoryId: product.categoryId, id: { not: product.id }, status: "active" },
      take: 4
    })
    .catch(() => []);

  const avgRating =
    publicReviews.length > 0
      ? publicReviews.reduce((s, r) => s + r.rating, 0) / publicReviews.length
      : null;

  const totalStock = product.variants.reduce((s, v) => s + v.stock, 0);
  const shipping = product.supplierLinks[0]?.supplier ? undefined : undefined;

  return (
    <>
      <RecentlyViewedTracker productId={product.id} />
      <section className="mx-4 mt-8 grid md:grid-cols-2 gap-8">
        <GlassPanel className="overflow-hidden p-0">
          <div className="relative aspect-square">
            {product.images[0] ? (
              <Image src={product.images[0]} alt={product.title} fill className="object-cover" priority />
            ) : (
              <div className="flex h-full items-center justify-center text-white/30 text-sm">No image yet</div>
            )}
          </div>
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
                <span className="text-white/40 line-through">{formatMoney(product.basePrice, product.currency)}</span>
              )}
            </div>
            <p className="mt-2 text-sm text-white/60">
              {totalStock > 5
                ? "In stock · Free shipping over $50"
                : totalStock > 0
                  ? `Only ${totalStock} left in stock`
                  : "Out of stock"}
            </p>
            <div className="mt-6 flex gap-3">
              <Button variant="primary" disabled={totalStock === 0}>Add to Cart</Button>
              <Button variant="glass" disabled={totalStock === 0}>Buy Now</Button>
              <WishlistButton productId={product.id} />
            </div>
          </GlassPanel>

          {product.variants.length > 0 && (
            <GlassPanel>
              <p className="text-sm font-medium mb-3">Variants</p>
              <ul className="text-sm text-white/70 space-y-1">
                {product.variants.map((v) => (
                  <li key={v.id}>
                    {Object.entries((v.options ?? {}) as Record<string, string>)
                      .map(([k, val]) => `${k}: ${val}`)
                      .join(" · ")}{" "}
                    — {formatMoney(v.price, product.currency)} ({v.stock} in stock)
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
          <h2 className="text-lg font-semibold mb-4">Reviews <span className="float-right"><ReviewForm productId={product.id} /></span></h2>
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

      <FeaturedProductsSection
        title="Related Products"
        products={related.map((p) => ({
          slug: p.slug,
          title: p.title,
          image: p.images[0] ?? "",
          price: Number(p.basePrice),
          salePrice: p.salePrice ? Number(p.salePrice) : undefined
        }))}
      />
      <RelatedProducts productId={product.id} categoryId={product.categoryId} />
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
              price: product.salePrice ? Number(product.salePrice) : Number(product.basePrice),
              priceCurrency: product.currency,
              availability: totalStock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
            },
            ...(publicReviews.length > 0
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
    </>
  );
}
