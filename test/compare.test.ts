import { describe, expect, it } from "vitest";
import { cheapestInStock, compareRows, type CompareProduct } from "@/lib/compare";

const a: CompareProduct = { id: "a", slug: "a", title: "Lamp", price: 30, salePrice: 24, stock: 3, rating: 4.5, attributes: { Material: "Metal" } };
const b: CompareProduct = { id: "b", slug: "b", title: "Mug", price: 12, stock: 0, rating: 4, attributes: { Material: "Ceramic" } };

describe("product comparison", () => {
  it("builds rows across all products", () => {
    const { headers, rows } = compareRows([a, b]);
    expect(headers).toEqual(["Lamp", "Mug"]);
    const price = rows.find((r) => r.label === "Price")!;
    expect(price.values).toEqual(["$24.00", "$12.00"]);
    const avail = rows.find((r) => r.label === "Availability")!;
    expect(avail.values).toEqual(["In stock", "Out of stock"]);
  });
  it("includes union of attributes", () => {
    const { rows } = compareRows([a, b]);
    const material = rows.find((r) => r.label === "Material")!;
    expect(material.values).toEqual(["Metal", "Ceramic"]);
  });
  it("flags sale items", () => {
    const { rows } = compareRows([a]);
    expect(rows.find((r) => r.label === "Sale")!.values).toEqual(["On sale"]);
  });
  it("cheapest in-stock skips out-of-stock", () => {
    expect(cheapestInStock([a, b])).toBe("a"); // mug is cheaper but out of stock
    expect(cheapestInStock([b])).toBeNull();
  });
});
