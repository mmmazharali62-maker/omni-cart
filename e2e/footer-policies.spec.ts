import { test, expect } from "@playwright/test";

// Policy + content pages (spec section 2/17/26): the legal trust surface.
const PAGES = ["/privacy", "/terms", "/refund-policy", "/contact", "/shipping-policy", "/faq", "/about"];

test.describe("policy and content pages", () => {
  for (const path of PAGES) {
    test(`${path} renders`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
    });
  }

  test("privacy policy mentions both markets", async ({ page }) => {
    await page.goto("/privacy");
    const text = await page.locator("body").textContent();
    expect(text).toContain("GDPR");
    expect(text).toContain("CCPA");
  });

  test("refund policy states the 30-day window", async ({ page }) => {
    await page.goto("/refund-policy");
    await expect(page.getByText(/30-day window/i)).toBeVisible();
  });
});
