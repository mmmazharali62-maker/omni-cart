import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

// Dynamic sitemap (spec section 23): static routes + all active products/categories.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://omnicart.example.com";
  const statics: MetadataRoute.Sitemap = ["", "/shop", "/deals", "/new-arrivals", "/best-sellers", "/help"].map(
    (p) => ({ url: `${base}${p}`, changeFrequency: "daily" as const, priority: p === "" ? 1 : 0.7 })
  );

  let products: MetadataRoute.Sitemap = [];
  let categories: MetadataRoute.Sitemap = [];
  try {
    const [prods, cats] = await Promise.all([
      db.product.findMany({ where: { status: "active" }, select: { slug: true, updatedAt: true } }),
      db.category.findMany({ select: { slug: true } })
    ]);
    products = prods.map((p) => ({
      url: `${base}/product/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.9
    }));
    categories = cats.map((c) => ({
      url: `${base}/categories/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6
    }));
  } catch {
    // DB not provisioned - static routes only.
  }

  return [...statics, ...products, ...categories];
}
