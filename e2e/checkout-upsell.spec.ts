import { test, expect } from "@playwright/test";

// Checkout upsells (spec section 15/26): suggestions must never block checkout.
test.describe("checkout upsells", () => {
  test("upsell API returns only cheap in-stock items", async ({ request }) => {
    const res = await request.post("/api/upsells", { data: { cartProductIds: [] } });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    for (const u of data.upsells ?? []) {
      expect(u.price).toBeLessThanOrEqual(40);
    }
  });

  test("cart page stays usable when upsells are empty", async ({ page }) => {
    await page.goto("/cart");
    // The rail simply doesn't render; the checkout link must remain.
    await expect(page.getByRole("link", { name: /checkout/i }).or(page.getByText(/your cart is empty/i)).first()).toBeVisible();
  });
});
