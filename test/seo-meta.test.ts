import { describe, expect, it } from "vitest";
import { pageMeta, productMeta } from "@/lib/seo-meta";

describe("seo-meta builders", () => {
  it("suffixes the site name to titles", () => {
    const m = pageMeta("Shop", "Browse our catalog");
    expect(m.title).toBe("Shop | Omni Cart");
  });
  it("adds openGraph fields for products", () => {
    const m = productMeta("Widget", "A widget", ["https://img.example/1.png"], "/product/widget");
    expect(m.openGraph?.title).toBe("Widget | Omni Cart");
    expect(m.openGraph?.images).toEqual(["https://img.example/1.png"]);
  });
});
