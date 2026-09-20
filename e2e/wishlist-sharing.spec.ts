import { test, expect } from "@playwright/test";

// Wishlist sharing (spec section 6/26).
test.describe("wishlist sharing", () => {
  test("share API requires a session", async ({ request }) => {
    const res = await request.post("/api/wishlist/share");
    expect([401, 403]).toContain(res.status());
    const body = await res.text();
    expect(body).not.toMatch(/userId/);
  });

  test("shared wishlist page 404s on invalid tokens", async ({ request }) => {
    const res = await request.get("/api/wishlist/shared/invalidtoken123");
    expect(res.status()).toBe(404);
  });

  test("wishlist page is reachable", async ({ page }) => {
    await page.goto("/wishlist");
    await expect(page).toHaveURL(/wishlist/);
  });
});
