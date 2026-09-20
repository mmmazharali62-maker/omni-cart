import { test, expect } from "@playwright/test";

// Admin flows (spec section 26): import UI, pricing, inventory.
// These run against a dev server; DB reads fall back to empty states gracefully.
test.describe("admin dashboard", () => {
  test("import page renders supplier picker", async ({ page }) => {
    await page.goto("/admin/products/import");
    await expect(page.getByRole("heading", { name: "Import Product" })).toBeVisible();
    await expect(page.getByText("CJ Dropshipping")).toBeVisible();
    await expect(page.getByText("AliExpress")).toBeVisible();
  });

  test("pricing page shows rules + coupon panels", async ({ page }) => {
    await page.goto("/admin/pricing");
    await expect(page.getByText("Automatic Pricing Rules")).toBeVisible();
    await expect(page.getByText("Create Coupon")).toBeVisible();
  });

  test("inventory page renders stock tiles", async ({ page }) => {
    await page.goto("/admin/inventory");
    await expect(page.getByText("Low stock (≤5)")).toBeVisible();
  });
});
