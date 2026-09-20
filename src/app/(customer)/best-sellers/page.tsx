import { db } from "@/lib/db";
import { ProductCard } from "@/components/product/product-card";

// Best sellers ranked by actual units sold (spec section 1/22).
export default async function BestSellersPage() {
  const top = await db.orderItem
    .groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 12
    })
    .catch(() => []);

  const products = top.length
    ? await db.product
        .findMany({
          where: { id: { in: top.map((t) => t.productId) }, status: "active" }
        })
        .then((prods) => {
          const rank = new Map(top.map((t) => [t.productId, t._sum.quantity ?? 0]));
          return prods.sort((a, b) => (rank.get(b.id) ?? 0) - (rank.get(a.id) ?? 0));
        })
        .catch(() => [])
    : [];

  return (
    <section className="mx-4 mt-12">
      <h1 className="text-2xl font-semibold mb-6">Best Sellers</h1>
      {products.length === 0 ? (
        <p className="text-white/50 text-sm">Sales rankings appear here once orders start coming in.</p>
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
