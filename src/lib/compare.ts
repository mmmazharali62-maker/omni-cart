// Product comparison (spec section 3): normalize product rows into a table.
export type CompareProduct = {
  id: string; slug: string; title: string; image?: string | null;
  price: number; salePrice?: number | null;
  rating?: number; stock?: number | null;
  attributes?: Record<string, string>;
};

export type CompareRow = { label: string; values: Array<string | null> };

const fmt = (n: number | null | undefined) => (n == null ? null : `$${n.toFixed(2)}`);

export function compareRows(products: CompareProduct[]): { headers: string[]; rows: CompareRow[] } {
  const headers = products.map((p) => p.title);
  const rows: CompareRow[] = [
    { label: "Price", values: products.map((p) => fmt(p.salePrice ?? p.price)) },
    { label: "Rating", values: products.map((p) => (p.rating ? `${p.rating.toFixed(1)} / 5` : null)) },
    { label: "Availability", values: products.map((p) => (p.stock == null ? null : p.stock > 0 ? "In stock" : "Out of stock")) },
    { label: "Sale", values: products.map((p) => (p.salePrice && p.salePrice < p.price ? "On sale" : null)) }
  ];
  const labels = new Set<string>();
  for (const p of products) for (const k of Object.keys(p.attributes ?? {})) labels.add(k);
  for (const label of labels) {
    rows.push({ label, values: products.map((p) => p.attributes?.[label] ?? null) });
  }
  return { headers, rows };
}

// Best-value highlighting: cheapest in-stock wins the price row.
export function cheapestInStock(products: CompareProduct[]): string | null {
  const inStock = products.filter((p) => (p.stock ?? 1) > 0);
  if (inStock.length === 0) return null;
  return inStock.reduce((best, p) => ((p.salePrice ?? p.price) < (best.salePrice ?? best.price) ? p : best)).id;
}
