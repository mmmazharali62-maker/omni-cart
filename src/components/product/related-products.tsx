import { db } from "@/lib/db";
import { ProductCard, type ProductCardData } from "./product-card";

// Same-category products, excluding the current one (spec section 3).
export async function RelatedProducts({ productId, categoryId }: { productId: string; categoryId: string | null }) {
  if (!categoryId) return null;
  const products = await db.product
    .findMany({ where: { categoryId, status: "active", id: { not: productId } }, take: 4 })
    .catch(() => []);

  if (products.length === 0) return null;

  return (
    <section className="mx-4 mt-16">
      <h2 className="text-2xl font-semibold mb-6">You Might Also Like</h2>
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
    </section>
  );
}
