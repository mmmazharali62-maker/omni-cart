import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ProductCard } from "@/components/product/product-card";
import { GlassPanel } from "@/components/ui/glass-panel";
import Link from "next/link";

export default async function WishlistPage() {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as any)?.id;

  const items = userId
    ? await db.wishlistItem.findMany({ where: { userId }, include: { product: true } }).catch(() => [])
    : [];

  return (
    <section className="mx-4 mt-12">
      <h1 className="text-2xl font-semibold mb-6">Wishlist</h1>
      {!userId ? (
        <GlassPanel className="text-center py-16">
          <p className="text-white/60">Sign in to save products to your wishlist.</p>
          <Link href="/account" className="text-brand-400 text-sm mt-2 inline-block">Go to account</Link>
        </GlassPanel>
      ) : items.length === 0 ? (
        <p className="text-white/50 text-sm">Your wishlist is empty. Tap ♡ on any product.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map(({ product: p }) => (
            <ProductCard
              key={p.id}
              product={{
                slug: p.slug,
                title: p.title,
                image: p.images[0] ?? "",
                price: Number(p.basePrice),
                salePrice: p.salePrice ? Number(p.salePrice) : undefined
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
