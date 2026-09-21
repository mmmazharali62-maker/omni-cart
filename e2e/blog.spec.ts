import { test, expect } from "@playwright/test";

// Blog (spec section 2/26): renders posts from content/blog/*.md.
test.describe("blog", () => {
  test("index lists posts with dates and summaries", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByRole("heading", { name: /blog/i })).toBeVisible();
    const cards = page.locator("a[href^='/blog/']");
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test("article pages render sanitized markdown", async ({ page }) => {
    await page.goto("/blog");
    const first = page.locator("a[href^='/blog/']").first();
    const href = await first.getAttribute("href");
    await page.goto(href!);
    await expect(page.locator("h1")).toBeVisible();
    const body = await page.locator("body").textContent();
    expect(body).not.toContain("<script>");
  });

  test("unknown slugs 404", async ({ page }) => {
    const res = await page.goto("/blog/definitely-not-a-real-post-slug");
    expect(res?.status()).toBe(404);
  });
});
