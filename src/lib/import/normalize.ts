// Supplier feed normalization (spec section 10): one product shape, any source.
export type RawProduct = {
  sourceId: string;
  source: "cj" | "aliexpress" | "amazon";
  title: string;
  description?: string;
  images?: string[];
  price?: string | number;
  listPrice?: string | number;
  currency?: string;
  stock?: number;
  variants?: Array<{ name: string; value: string; stock?: number }>;
  category?: string;
  weightGrams?: number;
};

export function parsePrice(v: string | number | undefined): number | null {
  if (v == null) return null;
  if (typeof v === "number") return Number.isFinite(v) && v >= 0 ? Math.round(v * 100) / 100 : null;
  const m = v.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
  return m ? Math.round(parseFloat(m[1]) * 100) / 100 : null;
}

export function cleanTitle(title: string): string {
  return title
    .replace(/\b(free shipping|dropshipping|dropship|hot sale|2026 new|2025 new)\b/gi, " ")
    .replace(/#[a-z0-9]+/gi, " ").replace(/[*]+/g, "")
    .replace(/!{2,}/g, "")
    .replace(/\s+-\s+$/g, " ")
    .replace(/\s*-{2,}\s*/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^[^a-zA-Z0-9]+/, "")
    .replace(/\s+$/, "")
    .slice(0, 160);
}

export function safeImages(images?: string[]): string[] {
  return (images ?? [])
    .filter((u) => /^https:\/\//.test(u) && /\.(jpe?g|png|webp|avif)(\?.*)?$/i.test(u))
    .slice(0, 8);
}

export function normalizeProduct(raw: RawProduct) {
  return {
    sourceId: raw.sourceId,
    source: raw.source,
    title: cleanTitle(raw.title),
    description: (raw.description ?? "").slice(0, 2000),
    images: safeImages(raw.images),
    price: parsePrice(raw.price),
    listPrice: parsePrice(raw.listPrice),
    currency: (raw.currency as "USD" | "GBP") ?? "USD",
    stock: Math.max(0, Math.floor(raw.stock ?? 0)),
    variants: (raw.variants ?? []).slice(0, 50),
    category: (raw.category ?? "uncategorized").toLowerCase().slice(0, 60),
    weightGrams: raw.weightGrams && raw.weightGrams > 0 ? raw.weightGrams : null
  };
}
