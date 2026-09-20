import { db } from "@/lib/db";
import { ProductCard } from "@/components/product/product-card";

// Flash deals: active products with a sale price (spec section 1/19).
export default async function DealsPage() {
  const products = await db.product
    .findMany({ where: { status: "active", salePrice: { not: null } }, orderBy: { updatedAt: "desc" }, take: 40 })
    .catch(() => []);

  return (
    <section className="mx-4 mt-12">
      <h1 className="text-2xl font-semibold mb-6">Flash Deals</h1>
      {products.length === 0 ? (
        <p className="text-white/50 text-sm">No active deals right now - check back soon!</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={{
                slug: p.slug,
                title: p.title,
                image: p.images[0] ?? "",
                price: Number(p.basePrice),
                salePrice: Number(p.salePrice!)
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ISR: refresh public catalog pages every 5 minutes (spec section 2).
export const revalidate = 300;
