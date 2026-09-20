import { test, expect } from "@playwright/test";
import { SEED } from "./fixtures/seed";
import { ShopPage } from "./fixtures/page-objects";

// Shop browsing + filtering (spec section 2/26).
test.describe("shop filters", () => {
  test("search narrows the grid", async ({ page }) => {
    const shop = new ShopPage(page);
    await shop.open();
    await shop.search(SEED.products[0].title);
    await expect(page.getByText(SEED.products[0].title)).toBeVisible();
  });

  test("in-stock filter hides sold-out products", async ({ page }) => {
    const shop = new ShopPage(page);
    await shop.open();
    await shop.filterInStockOnly();
    await expect(page.getByText("Out of stock")).toHaveCount(0);
  });

  test("pagination keeps filters applied", async ({ page }) => {
    await page.goto("/shop?inStock=1");
    await page.locator('a:has-text("2")').first().click();
    await expect(page).toHaveURL(/inStock=1/);
  });
});
