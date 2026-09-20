// Sitemap.xml builder (spec section 2: SEO).
export type SitemapEntry = { path: string; updatedAt?: Date; changeFreq?: "daily" | "weekly" | "monthly"; priority?: number };

export function buildSitemap(baseUrl: string, entries: SitemapEntry[]): string {
  const urls = entries.map((e) => {
    const loc = `${baseUrl.replace(/\/+$/, "")}${e.path}`;
    const mod = e.updatedAt ? `<lastmod>${e.updatedAt.toISOString().slice(0, 10)}</lastmod>` : "";
    const freq = e.changeFreq ? `<changefreq>${e.changeFreq}</changefreq>` : "";
    const pri = e.priority !== undefined ? `<priority>${e.priority.toFixed(1)}</priority>` : "";
    return `  <url><loc>${loc}</loc>${mod}${freq}${pri}</url>`;
  });
  return ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...urls, "</urlset>"].join("\n");
}
