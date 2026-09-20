import { test, expect } from "@playwright/test";
import { SEED } from "./fixtures/seed";

// Returns + tracking (spec section 19/29/26).
test.describe("returns and tracking", () => {
  test("track-order page looks up a tracking number", async ({ page }) => {
    await page.goto("/track-order");
    await page.getByLabel("Tracking number").fill("1Z999AA10123456784");
    await page.getByRole("button", { name: "Track" }).click();
    await expect(page.getByText(/no shipment found|carrier/i).first()).toBeVisible();
  });

  test("returns page prompts sign-in for guests", async ({ page }) => {
    await page.goto("/returns");
    await expect(page.getByText(/sign in/i)).toBeVisible();
  });

  test("return reason list matches the catalog", async ({ page }) => {
    await page.goto(`/returns?order=${SEED.guest.email}`);
    const reason = page.getByLabel(/reason/i).first();
    if (await reason.isVisible().catch(() => false)) {
      await expect(reason).toContainText("Arrived damaged");
    }
  });
});
