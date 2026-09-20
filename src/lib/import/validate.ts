import { z } from "zod";
import { normalizeProduct, type RawProduct } from "./normalize";

// Import gate (spec section 10): a supplier item must pass before it can
// enter the catalog, so junk feeds never reach the storefront.
const schema = z.object({
  sourceId: z.string().min(1).max(64),
  source: z.enum(["cj", "aliexpress", "amazon"]),
  title: z.string().min(5).max(300),
  description: z.string().max(5000).optional(),
  images: z.array(z.string().url()).max(20).optional(),
  price: z.union([z.string(), z.number()]).optional(),
  listPrice: z.union([z.string(), z.number()]).optional(),
  currency: z.enum(["USD", "GBP"]).optional(),
  stock: z.number().int().min(0).max(1_000_000).optional(),
  variants: z.array(z.object({ name: z.string().max(60), value: z.string().max(120), stock: z.number().optional() })).max(100).optional(),
  category: z.string().max(80).optional(),
  weightGrams: z.number().positive().max(50_000).optional()
});

export type ImportVerdict =
  | { ok: true; product: ReturnType<typeof normalizeProduct> }
  | { ok: false; errors: string[] };

export function validateImport(raw: unknown): ImportVerdict {
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, errors: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`) };
  }
  const product = normalizeProduct(parsed.data as RawProduct);
  const errors: string[] = [];
  if (product.title.length < 5) errors.push("title: too short after cleanup");
  if (product.images.length === 0) errors.push("images: no usable https image URLs");
  if (product.price == null || product.price <= 0) errors.push("price: missing or not positive");
  if (errors.length > 0) return { ok: false, errors };
  return { ok: true, product };
}

// Resale guard: hard floor so a glitchy feed can't create negative-margin items.
export function marginOk(cost: number, price: number, minMarginPct = 15): boolean {
  if (cost <= 0 || price <= 0) return false;
  return (price - cost) / price >= minMarginPct / 100;
}
