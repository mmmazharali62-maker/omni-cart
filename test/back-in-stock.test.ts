import { describe, expect, it } from "vitest";
import { renderBackInStock } from "@/lib/notifications/templates/back-in-stock";

describe("back-in-stock template", () => {
  it("mentions the product and links to its page", () => {
    const t = renderBackInStock({ productTitle: "Desk Lamp", slug: "desk-lamp" });
    expect(t.subject).toContain("Desk Lamp");
    expect(t.body).toContain("/product/desk-lamp");
  });
  it("includes variant and price when present", () => {
    const t = renderBackInStock({ productTitle: "Lamp", slug: "lamp", variant: "Black", price: "$9.99" });
    expect(t.body).toContain("Black");
    expect(t.body).toContain("$9.99");
  });
});
