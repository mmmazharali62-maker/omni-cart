import { describe, expect, it } from "vitest";
import { breadcrumbJsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/json-ld";

describe("json-ld builders", () => {
  it("builds an Organization node", () => {
    const ld = organizationJsonLd("Omni Cart", "https://omnicart.com");
    expect(ld["@type"]).toBe("Organization");
    expect(ld.name).toBe("Omni Cart");
  });
  it("builds a WebSite node with search action", () => {
    const ld = websiteJsonLd("Omni Cart", "https://omnicart.com");
    expect(ld.potentialAction["@type"]).toBe("SearchAction");
  });
  it("builds a 1-indexed BreadcrumbList", () => {
    const ld = breadcrumbJsonLd([{ name: "Home", url: "https://x.com" }, { name: "Shop", url: "https://x.com/shop" }]);
    expect(ld.itemListElement[0].position).toBe(1);
    expect(ld.itemListElement[1].position).toBe(2);
  });
});
