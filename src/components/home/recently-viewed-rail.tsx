"use client";

import { useEffect, useState } from "react";
import { getRecentlyViewed } from "@/components/product/recently-viewed";
import { ProductCard, type ProductCardData } from "@/components/product/product-card";

// Personalized "Recently Viewed" rail (spec section 1) - hydrates client-side
// from localStorage and fetches only those products.
export function RecentlyViewedRail() {
  const [products, setProducts] = useState<ProductCardData[]>([]);

  useEffect(() => {
    const ids = getRecentlyViewed();
    if (ids.length === 0) return;
    fetch(`/api/products/recently-viewed?ids=${ids.join(",")}`)
      .then((r) => r.json())
      .then((d) => setProducts(d.products ?? []))
      .catch(() => {});
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="mx-4 mt-16">
      <h2 className="text-2xl font-semibold mb-6">Recently Viewed</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => <ProductCard key={p.slug} product={p} />)}
      </div>
    </section>
  );
}
