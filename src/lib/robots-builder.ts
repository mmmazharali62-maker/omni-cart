// robots.txt builder (spec section 2): crawl everything, avoid admin/api.
export type RobotsInput = { baseUrl: string; sitemapUrl?: string };

export function buildRobots({ baseUrl, sitemapUrl }: RobotsInput): string {
  const base = baseUrl.replace(/\/+$/, "");
  const lines = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /api",
    "Disallow: /checkout",
    "Disallow: /account",
    "Disallow: /*?*sort=", // crawlable but low-value parameterized variants
    "",
    `Sitemap: ${sitemapUrl ?? `${base}/sitemap.xml`}`
  ];
  return lines.join("\n") + "\n";
}
