import { describe, expect, it } from "vitest";
import { sanitizeHtml, stripTags } from "@/lib/security/sanitize";

describe("html sanitization", () => {
  it("allows basic formatting tags only", () => {
    expect(sanitizeHtml("<b>bold</b> and <i>italic</i>")).toBe("<b>bold</b> and <i>italic</i>");
  });
  it("strips dangerous tags but keeps text", () => {
    expect(sanitizeHtml("<script>alert(1)</script>hello")).toBe("hello");
    expect(sanitizeHtml("<p onclick=\"evil()\">hi</p>")).toBe("<p>hi</p>");
  });
  it("neutralizes javascript: URLs and inline handlers", () => {
    const out = sanitizeHtml('<a href="javascript:alert(1)">x</a> onerror=alert(1)');
    expect(out.toLowerCase()).not.toContain("javascript:");
    expect(out.toLowerCase()).not.toContain("onerror=");
  });
  it("strips every tag for plain text", () => {
    expect(stripTags("<p>Great <b>product</b>!</p>")).toBe("Great product!");
  });
  it("truncates runaway input", () => {
    expect(sanitizeHtml("x".repeat(6000)).length).toBe(5000);
  });
});
