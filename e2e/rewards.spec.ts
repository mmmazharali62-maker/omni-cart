import { test, expect } from "@playwright/test";

// Rewards + referrals (spec section 15/26).
test.describe("rewards", () => {
  test("rewards page invites sign-in for guests", async ({ page }) => {
    await page.goto("/rewards");
    await expect(page.getByText(/sign in to/i).first()).toBeVisible();
  });

  test("referral API requires a session", async ({ request }) => {
    const res = await request.post("/api/referrals", { data: {} });
    expect([401, 403]).toContain(res.status());
  });

  test("loyalty tiers are explained", async ({ page }) => {
    await page.goto("/rewards");
    const text = await page.locator("body").textContent();
    expect(text).toContain("1 point per $1");
  });
});
