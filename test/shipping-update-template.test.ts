import { describe, expect, it } from "vitest";
import { renderShippingUpdate } from "@/lib/notifications/templates/shipping-update";

describe("shipping-update template", () => {
  it("includes carrier, tracking, and a live link", () => {
    const t = renderShippingUpdate({
      orderNumber: "OC-2609-XYZ", carrierLabel: "USPS", trackingNumber: "9400111899",
      trackingUrl: "https://tools.usps.com/...", etaWindow: "Sep 24-28"
    });
    expect(t.subject).toContain("has shipped");
    expect(t.body).toContain("USPS");
    expect(t.body).toContain("9400111899");
    expect(t.body).toContain("https://tools.usps.com/...");
    expect(t.body).toContain("Sep 24-28");
  });
});
