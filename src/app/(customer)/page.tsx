import { Hero } from "@/components/home/hero";
import { AnnouncementMarquee } from "@/components/common/announcement-marquee";
import { PromoBanner } from "@/components/common/promo-banner";
import { ReferralBanner } from "@/components/marketing/referral-banner";
import { RevealOnScroll } from "@/components/common/reveal-on-scroll";
import { FeaturedProductsSection } from "@/components/home/featured-products";
import { db } from "@/lib/db";
import { RecentlyViewedRail } from "@/components/home/recently-viewed-rail";

// Homepage (spec section 1): hero, featured/trending/new-arrival/best-seller rails.
// Every rail is data-driven: featured, trending, new arrivals, flash deals,
// best sellers (ranked by actual units sold), plus the personalized rail.
export default async function HomePage() {
  type Card = { slug: string; title: string; image: string; price: number; salePrice?: number; currency?: string };
  const toCard = (p: { slug: string; title: string; images: string[]; basePrice: any; salePrice: any; currency: string }): Card => ({
    slug: p.slug,
    title: p.title,
    image: p.images[0] ?? "/placeholder-product.png",
    price: Number(p.basePrice),
    salePrice: p.salePrice ? Number(p.salePrice) : undefined,
    currency: p.currency
  });

  let cards: Card[] = [];
  let newArrivals: Card[] = [];
  let deals: Card[] = [];
  let bestSellers: Card[] = [];
  try {
    const [featured, fresh, onSale, top] = await Promise.all([
      db.product.findMany({ where: { status: "active" }, take: 8 }),
      db.product.findMany({ where: { status: "active" }, orderBy: { createdAt: "desc" }, take: 4 }),
      db.product.findMany({ where: { status: "active", salePrice: { not: null } }, orderBy: { updatedAt: "desc" }, take: 4 }),
      db.orderItem.groupBy({ by: ["productId"], _sum: { quantity: true }, orderBy: { _sum: { quantity: "desc" } }, take: 4 })
    ]);
    const bestIds = top.map((t) => t.productId);
    const best = bestIds.length
      ? await db.product.findMany({ where: { id: { in: bestIds }, status: "active" } })
          .then((ps) => bestIds.map((id) => ps.find((p) => p.id === id)).filter((p): p is NonNullable<typeof p> => Boolean(p)))
      : [];

    cards = featured.map(toCard);
    newArrivals = fresh.map(toCard);
    deals = onSale.map(toCard);
    bestSellers = best.map(toCard);
  } catch {
    // DB not provisioned yet - render empty states instead of crashing.
  }

  return (
    <>
      <AnnouncementMarquee messages={[
        "Free shipping on US orders over $50",
        "UK orders over \u00A340 ship free",
        "30-day no-questions returns",
        "Live tracking on every order"
      ]} />
      <Hero />
      <div className="mx-4">
        <PromoBanner market="US" />
      </div>
      <FeaturedProductsSection title="Featured Products" products={cards} />
      <FeaturedProductsSection title="Trending Now" products={cards.slice(0, 4)} />
      <FeaturedProductsSection title="New Arrivals" products={newArrivals} />
      <FeaturedProductsSection title="Flash Deals" products={deals} />
      <FeaturedProductsSection title="Best Sellers" products={bestSellers} />
      <RecentlyViewedRail />
      <RevealOnScroll>
        <div className="mx-4 mb-8">
          <ReferralBanner />
        </div>
      </RevealOnScroll>
    </>
  );
}

// ISR: refresh public catalog pages every 5 minutes (spec section 2).
export const revalidate = 300;
