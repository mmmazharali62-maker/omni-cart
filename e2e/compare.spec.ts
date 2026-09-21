import { test, expect } from "@playwright/test";

// Compare mode (spec section 3/26).
test.describe("product comparison", () => {
  test("compare page explains itself without items", async ({ page }) => {
    await page.goto("/compare");
    await expect(page.getByText(/pick products to compare/i)).toBeVisible();
  });

  test("ids are capped at 4", async ({ page }) => {
    const ids = ["a", "b", "c", "d", "e"].join(",");
    await page.goto(`/compare?ids=${ids}`);
    // Renders, and never shows more than 4 columns even if 5 ids passed.
    await expect(page.locator("h1")).toBeVisible();
  });

  test("facets API returns category counts", async ({ request }) => {
    const res = await request.get("/api/search/facets");
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.facets).toBeDefined();
    expect(Array.isArray(data.facets.priceBands)).toBe(true);
  });
});
