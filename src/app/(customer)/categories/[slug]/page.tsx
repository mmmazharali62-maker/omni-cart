import { db } from "@/lib/db";
import { ProductCard } from "@/components/product/product-card";
import { notFound } from "next/navigation";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await db.category.findUnique({ where: { slug: params.slug } }).catch(() => null);
  if (!category) notFound();
  const products = await db.product.findMany({ where: { categoryId: category.id, status: "active" }, take: 60 }).catch(() => []);

  return (
    <section className="mx-4 mt-12">
      <h1 className="text-2xl font-semibold mb-6">{category.name}</h1>
      {products.length === 0 ? (
        <p className="text-white/50 text-sm">No products in this category yet.</p>
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
