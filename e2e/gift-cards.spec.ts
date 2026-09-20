import { test, expect } from "@playwright/test";

// Gift cards (spec section 15/16/26).
test.describe("gift cards", () => {
  test("page offers denominations and a balance checker", async ({ page }) => {
    await page.goto("/gift-cards");
    await expect(page.getByRole("heading", { name: /gift cards/i })).toBeVisible();
    await expect(page.getByText("$100", { exact: false }).first()).toBeVisible();
    await expect(page.getByLabel("Gift card code")).toBeVisible();
  });

  test("balance check rejects unknown codes politely", async ({ page }) => {
    await page.goto("/gift-cards");
    await page.getByLabel("Gift card code").fill("OMNI-AAAA-BBBB-CCCC");
    await page.getByRole("button", { name: /check balance/i }).click();
    await expect(page.getByText(/not found|invalid/i).first()).toBeVisible();
  });

  test("shared wishlist links reject bad tokens", async ({ page }) => {
    const res = await page.goto("/wishlist/shared/not-a-real-token");
    expect(res?.status()).toBe(404);
  });
});
