import { test, expect } from "@playwright/test";

// Product Q&A + back-in-stock (spec section 7/15/26).
test.describe("product Q&A", () => {
  test("qa api requires a product id", async ({ request }) => {
    const res = await request.get("/api/qa");
    expect(res.status()).toBe(400);
  });

  test("qa api rejects junk questions", async ({ request }) => {
    const res = await request.post("/api/qa", {
      data: { productId: "prod_e2e", email: "e2e@omnicart.test", question: "hi" }
    });
    expect([400, 404]).toContain(res.status());
  });

  test("back-in-stock api validates emails", async ({ request }) => {
    const res = await request.post("/api/back-in-stock", {
      data: { variantId: "variant_e2e", email: "not-an-email" }
    });
    expect([400, 404]).toContain(res.status());
  });

  test("accessibility statement is public", async ({ page }) => {
    await page.goto("/accessibility");
    await expect(page.getByText(/WCAG 2.1/i)).toBeVisible();
  });
});
