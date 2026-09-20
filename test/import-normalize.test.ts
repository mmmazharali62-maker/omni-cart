import { describe, expect, it } from "vitest";
import { cleanTitle, normalizeProduct, parsePrice, safeImages } from "@/lib/import/normalize";

describe("import normalization", () => {
  it("parses messy price strings", () => {
    expect(parsePrice("$12.99")).toBe(12.99);
    expect(parsePrice("USD 1,234.56")).toBe(1234.56);
    expect(parsePrice("free")).toBeNull();
    expect(parsePrice(-5)).toBeNull();
  });
  it("cleans supplier junk from titles", () => {
    const t = cleanTitle("HOT SALE!! Wireless Earbuds - free shipping 2026 new  #best");
    expect(t).toBe("Wireless Earbuds");
    expect(t.length).toBeLessThanOrEqual(160);
  });
  it("keeps only safe https image URLs", () => {
    const imgs = safeImages(["https://x.com/a.jpg", "http://x.com/b.jpg", "https://x.com/c.png", "javascript:alert(1).jpg"]);
    expect(imgs).toEqual(["https://x.com/a.jpg", "https://x.com/c.png"]);
  });
  it("normalizes a full raw product", () => {
    const p = normalizeProduct({
      sourceId: "cj-1", source: "cj", title: "LED Strip 5m",
      price: "$19.99", images: ["https://x.com/l.jpg"], stock: 42, category: "Home & Garden"
    });
    expect(p.price).toBe(19.99);
    expect(p.category).toBe("home & garden");
    expect(p.stock).toBe(42);
  });
});
