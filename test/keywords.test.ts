import { describe, expect, it } from "vitest";
import { extractKeywords, metaDescription, metaKeywords } from "@/lib/keywords";

describe("SEO keywords", () => {
  it("ranks repeated meaningful words first", () => {
    const kws = extractKeywords("Wireless earbuds with wireless charging and great battery. Wireless wins.");
    expect(kws[0]).toBe("wireless");
    expect(kws).not.toContain("the");
  });
  it("drops stopwords and short words", () => {
    const kws = extractKeywords("the a an is it of to");
    expect(kws).toEqual([]);
  });
  it("respects the limit", () => {
    expect(extractKeywords("alpha beta gamma delta epsilon", 3)).toHaveLength(3);
  });
  it("builds meta keywords csv", () => {
    expect(metaKeywords("soft warm blanket for winter nights")).toContain(",");
  });
  it("truncates meta descriptions at word boundaries", () => {
    const long = "word ".repeat(40).trim();
    const d = metaDescription(long);
    expect(d.length).toBeLessThanOrEqual(160);
    expect(d.endsWith("...")).toBe(true);
  });
  it("keeps short descriptions intact", () => {
    expect(metaDescription("Buy nice things")).toBe("Buy nice things");
  });
});
