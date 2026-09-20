import { ProductCard, type ProductCardData } from "@/components/product/product-card";

export function FeaturedProductsSection({
  title,
  products
}: {
  title: string;
  products: ProductCardData[];
}) {
  return (
    <section className="mx-4 mt-16">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      {products.length === 0 ? (
        <p className="text-white/50 text-sm">No products yet - import your first product from the admin dashboard.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
