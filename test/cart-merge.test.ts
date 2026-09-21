import { describe, expect, it } from "vitest";
import { mergeCarts, needsMerge, type CartLine } from "@/lib/cart/merge";

describe("cart merge", () => {
  const user: CartLine[] = [{ productId: "a", variantId: "v1", quantity: 2 }];
  const guest: CartLine[] = [
    { productId: "a", variantId: "v1", quantity: 1 },
    { productId: "b", variantId: null, quantity: 3 }
  ];
  it("adds quantities for the same product+variant", () => {
    const merged = mergeCarts(user, guest);
    const a = merged.find((l) => l.productId === "a")!;
    expect(a.quantity).toBe(3);
    expect(merged).toHaveLength(2);
  });
  it("caps quantities at 99", () => {
    const merged = mergeCarts([{ productId: "a", variantId: null, quantity: 98 }], [{ productId: "a", variantId: null, quantity: 50 }]);
    expect(merged[0].quantity).toBe(99);
  });
  it("treats missing variants as their own line", () => {
    const merged = mergeCarts([{ productId: "x", variantId: "red", quantity: 1 }], [{ productId: "x", variantId: "blue", quantity: 1 }]);
    expect(merged).toHaveLength(2);
  });
  it("only needs merging when both carts have items", () => {
    expect(needsMerge(user, guest)).toBe(true);
    expect(needsMerge(user, [])).toBe(false);
  });
});
