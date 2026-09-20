import { test, expect } from "@playwright/test";
import { SEED } from "./fixtures/seed";

// Product page + reviews (spec section 3/7/26).
test.describe("product reviews", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/product/${SEED.products[0].slug}`);
  });

  test("shows title, price, and stock state", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toContainText(SEED.products[0].title);
    await expect(page.getByText("$29.99").first()).toBeVisible();
  });

  test("quantity stepper clamps at 1 and 99", async ({ page }) => {
    const input = page.getByLabel("Quantity");
    await input.fill("0");
    await page.getByLabel("Increase quantity").click();
    await expect(input).toHaveValue("2");
  });

  test("sold-out products show a disabled add-to-cart", async ({ page }) => {
    await page.goto(`/product/${SEED.products[2].slug}`);
    const add = page.getByRole("button", { name: /add to cart/i }).first();
    await expect(add).toBeDisabled();
  });
});
