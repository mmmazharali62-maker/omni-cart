import { test, expect } from "@playwright/test";

// Integrations admin (spec section 17/19/26): guarded, never leaks secrets.
test.describe("admin integrations", () => {
  test("requires an admin session", async ({ page }) => {
    await page.goto("/admin/integrations");
    // Middleware redirects non-admins away from the admin area.
    await expect(page).not.toHaveURL(/\/admin\/integrations/);
  });

  test("api rejects anonymous readers", async ({ request }) => {
    const res = await request.get("/api/admin/integrations");
    expect([401, 403]).toContain(res.status());
    const body = await res.json().catch(() => ({}));
    expect(JSON.stringify(body)).not.toMatch(/sk_live|whsec_/);
  });

  test("webhook endpoints validate tokens when configured", async ({ request }) => {
    const res = await request.post("/api/webhooks/cj", { data: { event: "order.shipped" } });
    // 401 when a token env is set, 200/400 otherwise - never a 5xx.
    expect(res.ok() || [400, 401].includes(res.status())).toBeTruthy();
  });
});
