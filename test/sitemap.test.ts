import { describe, expect, it } from "vitest";
import { buildSitemap } from "@/lib/sitemap";

describe("sitemap builder", () => {
  it("emits a valid urlset", () => {
    const xml = buildSitemap("https://omnicart.com/", [
      { path: "/", priority: 1, changeFreq: "daily" },
      { path: "/shop", priority: 0.8, changeFreq: "weekly", updatedAt: new Date("2026-01-01") }
    ]);
    expect(xml).toContain("<urlset");
    expect(xml).toContain("<loc>https://omnicart.com/</loc>");
    expect(xml).toContain("<lastmod>2026-01-01</lastmod>");
    expect(xml).toContain("<priority>1.0</priority>");
  });
  it("handles many entries", () => {
    const xml = buildSitemap("https://x.com", Array.from({ length: 10 }, (_, i) => ({ path: `/p/${i}` })));
    expect(xml.match(/<url>/g)?.length).toBe(10);
  });
  it("trims trailing slashes on the base URL", () => {
    expect(buildSitemap("https://x.com//", [{ path: "/a" }])).toContain("https://x.com/a");
  });
});
