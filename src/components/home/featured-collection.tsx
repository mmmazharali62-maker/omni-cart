import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";

// Curated collection rail (spec section 1): a title + product grid.
export function FeaturedCollection({
  title,
  href,
  products
}: {
  title: string;
  href: string;
  products: Array<{ product: React.ComponentProps<typeof ProductCard>["product"] }>;
}) {
  return (
    <div className="mx-4 mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Link href={href} className="text-sm text-brand-400 hover:underline">View all →</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p, i) => (
          <ProductCard key={p.product.slug} product={p.product} />
        ))}
      </div>
    </div>
  );
}
