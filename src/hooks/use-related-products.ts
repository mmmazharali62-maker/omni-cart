"use client";

import { useEffect, useState } from "react";

// Fetch related products for a product page (spec section 3).
export function useRelatedProducts(productId: string | null) {
  const [products, setProducts] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) return;
    let mounted = true;
    setLoading(true);
    fetch(`/api/products/${productId}/related`)
      .then((r) => (r.ok ? r.json() : { products: [] }))
      .then((d) => { if (mounted) setProducts(d.products ?? []); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [productId]);

  return { products, loading };
}
