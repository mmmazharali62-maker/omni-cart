import { describe, expect, it } from "vitest";
import { renderNewsletterWelcome } from "@/lib/notifications/templates/newsletter-welcome";

describe("newsletter welcome template", () => {
  it("welcomes without an offer", () => {
    const t = renderNewsletterWelcome({});
    expect(t.subject).toBe("Welcome to Omni Cart");
    expect(t.body).toContain("Thanks for subscribing");
    expect(t.body).not.toContain("% off");
  });
  it("includes the discount code when given", () => {
    const t = renderNewsletterWelcome({ discountCode: "WELCOME10", discountPct: 10 });
    expect(t.body).toContain("WELCOME10");
    expect(t.body).toContain("10% off");
  });
});
