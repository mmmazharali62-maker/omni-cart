import { test, expect } from "@playwright/test";

// Happy-path customer flows (spec section 26): browse -> search -> product.
test.describe("customer storefront", () => {
  test("homepage renders with nav and hero", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: "Shop" }).first()).toBeVisible();
  });

  test("shop page loads and filters are present", async ({ page }) => {
    await page.goto("/shop");
    await expect(page.getByRole("heading", { name: "Shop" })).toBeVisible();
    await expect(page.locator("select[name=category]")).toBeVisible();
    await expect(page.locator("select[name=sort]")).toBeVisible();
  });

  test("search page accepts a query", async ({ page }) => {
    await page.goto("/search?q=lamp");
    await expect(page.getByRole("heading", { name: "Search" })).toBeVisible();
  });

  test("help page shows guest order lookup", async ({ page }) => {
    await page.goto("/help");
    await expect(page.getByText("Track an order without an account")).toBeVisible();
  });

  test("admin routes are protected", async ({ page }) => {
    await page.goto("/admin");
    // Middleware must redirect unauthenticated users away from /admin.
    await page.waitForURL(/\/account|\/admin/);
    expect(page.url()).not.toMatch(/\/admin$/);
  });
});
