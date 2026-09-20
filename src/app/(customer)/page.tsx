import { Hero } from "@/components/home/hero";
import { FeaturedProductsSection } from "@/components/home/featured-products";
import { db } from "@/lib/db";

// Homepage (spec section 1): hero, featured/trending/new-arrival/best-seller rails.
// Product fetching is intentionally simple for now - swap in real "trending"/
// "best seller" ranking logic once order/view analytics exist.
export default async function HomePage() {
  let products: Awaited<ReturnType<typeof db.product.findMany>> = [];
  try {
    products = await db.product.findMany({ where: { status: "active" }, take: 8 });
  } catch {
    // DB not provisioned yet during early scaffold - render an empty state instead of crashing.
    products = [];
  }

  const cards = products.map((p) => ({
    slug: p.slug,
    title: p.title,
    image: p.images[0] ?? "/placeholder-product.png",
    price: Number(p.basePrice),
    salePrice: p.salePrice ? Number(p.salePrice) : undefined,
    currency: p.currency
  }));

  return (
    <>
      <Hero />
      <FeaturedProductsSection title="Featured Products" products={cards} />
      <FeaturedProductsSection title="Trending Now" products={cards} />
      <FeaturedProductsSection title="New Arrivals" products={[]} />
      <FeaturedProductsSection title="Flash Deals" products={[]} />
      <FeaturedProductsSection title="Best Sellers" products={[]} />
    </>
  );
}
