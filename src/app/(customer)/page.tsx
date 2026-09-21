import { Suspense } from "react";
import { Hero } from "@/components/home/hero";
import { AnnouncementMarquee } from "@/components/common/announcement-marquee";
import { PromoBanner } from "@/components/common/promo-banner";
import { ReferralBanner } from "@/components/marketing/referral-banner";
import { RailSkeleton } from "@/components/home/rail-skeleton";
import { RecentlyViewedLazy } from "@/components/home/recently-viewed-lazy";
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { FeaturedProductsSection } from "@/components/home/featured-products";

// Homepage (spec section 1). Perf model:
// - Shell (hero + banners) renders instantly: it has zero data deps, so LCP
//   is text-only and never waits on the database.
// - Each rail is its own async component streamed via Suspense with a
//   skeleton, so one slow query can't hold the page hostage.
// - Queries project only the fields the cards render.
type Card = { slug: string; title: string; image: string; price: number; salePrice?: number; currency?: string };

const CARD_SELECT = {
  id: true, slug: true, title: true, images: true, basePrice: true, salePrice: true, currency: true
} as const;

const toCard = (p: { slug: string; title: string; images: string[]; basePrice: unknown; salePrice: unknown; currency: string }): Card => ({
  slug: p.slug,
  title: p.title,
  image: p.images[0] ?? "/placeholder-product.png",
  price: Number(p.basePrice),
  salePrice: p.salePrice ? Number(p.salePrice) : undefined,
  currency: p.currency
});

async function fetchCards(where: Prisma.ProductWhereInput, order: Prisma.ProductOrderByWithRelationInput | undefined, take: number): Promise<Card[]> {
  const products = await db.product.findMany({ where, orderBy: order, take, select: CARD_SELECT }).catch(() => []);
  return products.map((p) => toCard({ ...p, basePrice: p.basePrice, salePrice: p.salePrice }));
}

async function FeaturedRail() {
  const cards = await fetchCards({ status: "active" }, undefined, 8);
  return <FeaturedProductsSection title="Featured Products" products={cards} />;
}

async function NewArrivalsRail() {
  const cards = await fetchCards({ status: "active" }, { createdAt: "desc" }, 4);
  return <FeaturedProductsSection title="New Arrivals" products={cards} />;
}

async function DealsRail() {
  const cards = await fetchCards({ status: "active", salePrice: { not: null } }, { updatedAt: "desc" }, 4);
  return <FeaturedProductsSection title="Flash Deals" products={cards} />;
}

async function BestSellersRail() {
  try {
    const top = await db.orderItem.groupBy({
      by: ["productId"], _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } }, take: 4
    });
    const ids = top.map((t) => t.productId);
    if (ids.length === 0) return null;
    const products = await db.product.findMany({ where: { id: { in: ids }, status: "active" }, select: CARD_SELECT });
    const byId = new Map(products.map((p) => [p.id, p]));
    const found = ids.map((id) => byId.get(id)).filter((p): p is NonNullable<typeof p> => Boolean(p));
    const cards = found.map(toCard);
    if (cards.length === 0) return null;
    return <FeaturedProductsSection title="Best Sellers" products={cards} />;
  } catch {
    return null; // no order data yet - hide the rail instead of an error
  }
}

export default function HomePage() {
  return (
    <>
      <AnnouncementMarquee messages={[
        "Free shipping on US orders over $50",
        "UK orders over \u00A340 ship free",
        "30-day no-questions returns",
        "Live tracking on every order"
      ]} />
      <Hero />
      <PromoBanner market="US" />
      <Suspense fallback={<RailSkeleton cards={8} />}>
        <FeaturedRail />
      </Suspense>
      <Suspense fallback={<RailSkeleton />}>
        <NewArrivalsRail />
      </Suspense>
      <Suspense fallback={<RailSkeleton />}>
        <DealsRail />
      </Suspense>
      <Suspense fallback={<RailSkeleton />}>
        <BestSellersRail />
      </Suspense>
      <RecentlyViewedLazy />
      <div className="reveal-on-scroll mx-4 mb-8">
        <ReferralBanner />
      </div>
    </>
  );
}

// ISR: refresh public catalog pages every 5 minutes (spec section 2).
export const revalidate = 300;
