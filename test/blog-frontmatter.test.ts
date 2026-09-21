import { describe, expect, it } from "vitest";
import { parseFrontmatter, slugifyTitle } from "@/lib/blog/frontmatter";

describe("blog frontmatter", () => {
  it("parses the header block", () => {
    const { data, body } = parseFrontmatter("---\ntitle: My Post\nsummary: A post\ndate: 2026-09-20\ntags: uk, shipping\n---\n\nBody here");
    expect(data.title).toBe("My Post");
    expect(data.date).toBe("2026-09-20");
    expect(data.tags).toEqual(["uk", "shipping"]);
    expect(body.trim()).toBe("Body here");
  });
  it("falls back gracefully without frontmatter", () => {
    const { data, body } = parseFrontmatter("Just body text");
    expect(data.title).toBe("Untitled");
    expect(body).toBe("Just body text");
  });
  it("slugifies titles for URLs", () => {
    expect(slugifyTitle("UK Shipping Explained: Zones & Rules")).toBe("uk-shipping-explained-zones-rules");
    expect(slugifyTitle("---")).toBe("");
  });
});
