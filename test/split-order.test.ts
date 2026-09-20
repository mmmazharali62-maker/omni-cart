import { describe, expect, it } from "vitest";
import { shipmentLabels, splitOrder } from "@/lib/suppliers/split-order";

describe("order splitting", () => {
  it("groups items by supplier", () => {
    const splits = splitOrder({
      orderId: "o1",
      items: [
        { itemId: "i1", supplierId: "cj", price: 10 },
        { itemId: "i2", supplierId: "cj", price: 5 },
        { itemId: "i3", supplierId: "ali", price: 20 }
      ]
    });
    expect(splits).toHaveLength(2);
    const cj = splits.find((s) => s.supplierId === "cj");
    expect(cj?.itemIds).toEqual(["i1", "i2"]);
    expect(cj?.subtotal).toBe(15);
  });
  it("handles single-supplier orders", () => {
    const splits = splitOrder({ orderId: "o", items: [{ itemId: "i", supplierId: "cj", price: 3 }] });
    expect(splits).toHaveLength(1);
  });
  it("labels shipments for customers", () => {
    const labels = shipmentLabels([
      { supplierId: "cj", itemIds: ["a", "b"], subtotal: 1 },
      { supplierId: "ali", itemIds: ["c"], subtotal: 2 }
    ]);
    expect(labels[0]).toContain("1 of 2");
    expect(labels[0]).toContain("2 items");
    expect(labels[1]).toContain("1 item");
  });
});
