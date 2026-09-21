// Search facets (spec section 9): filter counts for the shop sidebar.
export type FacetProduct = { categoryId: string | null; price: number; inStock: boolean; rating?: number | null };

export type Facets = {
  categories: Array<{ id: string; count: number }>;
  priceBands: Array<{ label: string; min: number; max: number; count: number }>;
  availability: { inStock: number; outOfStock: number };
};

const BANDS: Array<{ label: string; min: number; max: number }> = [
  { label: "Under $10", min: 0, max: 10 },
  { label: "$10 - $25", min: 10, max: 25 },
  { label: "$25 - $50", min: 25, max: 50 },
  { label: "$50 - $100", min: 50, max: 100 },
  { label: "$100+", min: 100, max: Infinity }
];

export function computeFacets(products: FacetProduct[]): Facets {
  const catCounts = new Map<string, number>();
  for (const p of products) {
    if (p.categoryId) catCounts.set(p.categoryId, (catCounts.get(p.categoryId) ?? 0) + 1);
  }
  return {
    categories: [...catCounts.entries()]
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count),
    priceBands: BANDS.map((b) => ({
      label: b.label, min: b.min, max: b.max === Infinity ? -1 : b.max,
      count: products.filter((p) => p.price >= b.min && p.price < b.max).length
    })).filter((b) => b.count > 0),
    availability: {
      inStock: products.filter((p) => p.inStock).length,
      outOfStock: products.filter((p) => !p.inStock).length
    }
  };
}
