import { describe, it, expect } from "vitest";
import { addToCartSchema, checkoutSchema, reviewSchema } from "@/lib/validation";

describe("validation schemas", () => {
  it("accepts a valid cart add", () => {
    expect(addToCartSchema.parse({ variantId: "v1", quantity: 2 })).toEqual({ variantId: "v1", quantity: 2 });
  });

  it("rejects zero/negative quantity", () => {
    expect(() => addToCartSchema.parse({ variantId: "v1", quantity: 0 })).toThrow();
    expect(() => addToCartSchema.parse({ variantId: "v1", quantity: -1 })).toThrow();
  });

  it("caps quantity at 99", () => {
    expect(() => addToCartSchema.parse({ variantId: "v1", quantity: 100 })).toThrow();
  });

  it("only allows US/GB shipping countries", () => {
    const base = { items: [{ variantId: "v", quantity: 1 }], email: "a@b.com", shippingMethod: "standard" as const };
    const address = (country: string) => ({
      fullName: "Test User", line1: "123 Main St", city: "LA", postalCode: "90001", country
    });
    expect(() => checkoutSchema.parse({ ...base, shippingAddress: address("US") })).not.toThrow();
    expect(() => checkoutSchema.parse({ ...base, shippingAddress: address("GB") })).not.toThrow();
    expect(() => checkoutSchema.parse({ ...base, shippingAddress: address("DE") })).toThrow();
  });

  it("rejects invalid review ratings", () => {
    expect(() => reviewSchema.parse({ productId: "p", rating: 0 })).toThrow();
    expect(() => reviewSchema.parse({ productId: "p", rating: 6 })).toThrow();
    expect(() => reviewSchema.parse({ productId: "p", rating: 5 })).not.toThrow();
  });
});
