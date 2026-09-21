import { describe, expect, it } from "vitest";
import { excerpt, renderMarkdown } from "@/lib/blog/markdown";

describe("blog markdown", () => {
  it("renders headings and emphasis", () => {
    const html = renderMarkdown("# Title\nSome **bold** and *italic* text.");
    expect(html).toContain("<h1>Title</h1>");
    expect(html).toContain("<strong>bold</strong>");
    expect(html).toContain("<em>italic</em>");
  });
  it("renders lists", () => {
    const html = renderMarkdown("- one\n- two\n\npara");
    expect(html).toContain("<ul>");
    expect(html).toContain("<li>one</li>");
    expect(html).toContain("<li>two</li>");
    expect(html).toContain("<p>para</p>");
  });
  it("renders safe https links only", () => {
    expect(renderMarkdown("[x](https://ok.com)")).toContain('href="https://ok.com"');
    expect(renderMarkdown("[x](http://bad.com)")).not.toContain("href=");
  });
  it("escapes raw html (xss-safe)", () => {
    expect(renderMarkdown("<script>alert(1)</script>")).not.toContain("<script>");
  });
  it("builds clean excerpts", () => {
    const md = "# Heading\nThis is the **summary** of a [link](https://x.com) longer than needed. ".repeat(5);
    const e = excerpt(md);
    expect(e.length).toBeLessThanOrEqual(160);
    expect(e).not.toContain("[");
  });
});
