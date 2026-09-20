import { describe, expect, it } from "vitest";
import { marginOk, validateImport } from "@/lib/import/validate";

const valid = {
  sourceId: "cj-100", source: "cj", title: "Wireless Earbuds Pro",
  images: ["https://cdn.example.com/1.jpg"], price: "29.99"
};

describe("import validation", () => {
  it("accepts a clean product", () => {
    const verdict = validateImport(valid);
    expect(verdict.ok).toBe(true);
    if (verdict.ok) expect(verdict.product.price).toBe(29.99);
  });
  it("rejects unknown sources and bad shapes", () => {
    expect(validateImport({ ...valid, source: "temu" }).ok).toBe(false);
    expect(validateImport({ ...valid, title: "" }).ok).toBe(false);
    expect(validateImport("nonsense").ok).toBe(false);
  });
  it("rejects products without usable images or price", () => {
    expect(validateImport({ ...valid, images: [] }).ok).toBe(false);
    expect(validateImport({ ...valid, price: "ask seller" }).ok).toBe(false);
  });
  it("collects all error messages", () => {
    const verdict = validateImport({ ...valid, images: [], price: "n/a" });
    if (!verdict.ok) {
      expect(verdict.errors.length).toBeGreaterThanOrEqual(2);
      expect(verdict.errors.some((e) => e.includes("images"))).toBe(true);
    }
  });
  it("guards margins on pricing", () => {
    expect(marginOk(10, 30)).toBe(true);
    expect(marginOk(30, 31)).toBe(false);
    expect(marginOk(0, 10)).toBe(false);
  });
});
