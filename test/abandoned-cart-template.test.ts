import { describe, expect, it } from "vitest";
import { renderAbandonedCart } from "@/lib/notifications/templates/abandoned-cart";

describe("abandoned-cart template", () => {
  it("names the first item in the subject for single items", () => {
    const t = renderAbandonedCart({
      items: [{ title: "Desk Lamp", quantity: 1, price: "$25.00" }],
      cartUrl: "https://omnicart.com/cart"
    });
    expect(t.subject).toContain("Desk Lamp");
    expect(t.body).toContain("$25.00");
  });
  it("counts multiple items in the subject", () => {
    const t = renderAbandonedCart({
      items: [
        { title: "A", quantity: 1, price: "$5" },
        { title: "B", quantity: 2, price: "$10" }
      ],
      cartUrl: "/cart"
    });
    expect(t.subject).toContain("2 items");
    expect(t.body).toContain("2x B");
  });
  it("adds a comeback discount when offered", () => {
    const t = renderAbandonedCart({
      items: [{ title: "A", quantity: 1, price: "$5" }],
      cartUrl: "/cart",
      discountPct: 15
    });
    expect(t.body).toContain("COMEBACK15");
  });
});
