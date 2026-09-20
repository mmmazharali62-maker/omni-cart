import { db } from "@/lib/db";
import { ProductCard } from "@/components/product/product-card";

export default async function NewArrivalsPage() {
  const products = await db.product
    .findMany({ where: { status: "active" }, orderBy: { createdAt: "desc" }, take: 24 })
    .catch(() => []);

  return (
    <section className="mx-4 mt-12">
      <h1 className="text-2xl font-semibold mb-6">New Arrivals</h1>
      {products.length === 0 ? (
        <p className="text-white/50 text-sm">Fresh stock lands here as soon as it's imported.</p>
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
                salePrice: p.salePrice ? Number(p.salePrice) : undefined
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
