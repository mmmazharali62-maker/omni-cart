import { describe, expect, it } from "vitest";
import { renderReturnUpdated } from "@/lib/notifications/templates/return-updated";

describe("return-updated template", () => {
  it("renders requested status with customer name", () => {
    const t = renderReturnUpdated("requested", { name: "Ali", orderId: "abcdef123456" });
    expect(t.body).toContain("Ali");
    expect(t.body).toContain("abcdef12");
  });
  it("defaults name to 'there' and includes amount for refunds", () => {
    const t = renderReturnUpdated("refunded", { orderId: "abcdef123456", amount: "$19.99" });
    expect(t.body).toContain("there");
    expect(t.body).toContain("$19.99");
  });
});
