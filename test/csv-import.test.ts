import { describe, expect, it } from "vitest";
import { normalizeRow, parseCsv } from "@/lib/csv-import";

describe("csv import", () => {
  it("parses simple csv with headers", () => {
    const { rows, errors } = parseCsv("title,price,stock\nLamp,24.99,3\nMug,9.99,0");
    expect(rows).toHaveLength(2);
    expect(rows[0].title).toBe("Lamp");
    expect(errors).toHaveLength(0);
  });
  it("handles quoted cells and embedded commas", () => {
    const { rows } = parseCsv('title,description\n"Cool, Blue Mug","Says ""hi"" on it"');
    expect(rows[0].title).toBe("Cool, Blue Mug");
    expect(rows[0].description).toContain('"hi"');
  });
  it("reports missing title columns", () => {
    const { errors } = parseCsv("price,stock\n5,1");
    expect(errors.some((e) => e.includes("title"))).toBe(true);
  });
  it("rejects empty files and caps rows", () => {
    expect(parseCsv("").errors[0]).toContain("empty");
    const big = "title\n" + Array.from({ length: 2000 }, () => "x").join("\n");
    expect(parseCsv(big, 100).errors.some((e) => e.includes("first"))).toBe(true);
  });
  it("normalizes shopify-style rows", () => {
    const row = normalizeRow({ Title: "ignored", title: "Lamp", "Variant Price": "$24.99", "Inventory Quantity": "3", "Variant SKU": "LP-1" });
    expect(row.title).toBe("Lamp");
    expect(row.price).toBe(24.99);
    expect(row.stock).toBe(3);
    expect(row.sku).toBe("LP-1");
  });
});
