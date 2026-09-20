import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { isValidShareToken } from "@/lib/wishlist-sharing";
import { ProductCard } from "@/components/product/product-card";
import { EmptyState } from "@/components/ui/empty-state";
import { GlassPanel } from "@/components/ui/glass-panel";

export const metadata = { title: "Shared Wishlist | Omni Cart" };

// A shared wishlist - public via token, no owner details exposed (spec section 6).
export default async function SharedWishlistPage({ params }: { params: { token: string } }) {
  if (!isValidShareToken(params.token)) notFound();

  const items = await db.wishlistItem.findMany({ take: 100 }).catch(() => []);
  const productIds = [...new Set(items.map((i) => i.productId))].slice(0, 100);

  const products = productIds.length
    ? await db.product.findMany({
        where: { id: { in: productIds }, status: "ACTIVE" },
        select: { slug: true, title: true, images: true, basePrice: true }
      }).catch(() => [])
    : [];

  return (
    <section className="mx-4 mt-12 max-w-5xl">
      <GlassPanel className="p-4 mb-6">
        <h1 className="text-2xl font-semibold">A wishlist shared with you</h1>
        <p className="text-sm text-white/50 mt-1">Someone thought you'd like these. Items are one tap away from your own cart.</p>
      </GlassPanel>
      {products.length === 0 ? (
        <EmptyState title="Nothing here yet" message="This wishlist is empty or the link is no longer valid." />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p, i) => (
            <ProductCard key={p.slug} product={{
              slug: p.slug,
              title: p.title,
              image: (p.images ?? [])[0] ?? "/placeholder.png",
              price: Number(p.basePrice)
            }} />
          ))}
        </div>
      )}
    </section>
  );
}
