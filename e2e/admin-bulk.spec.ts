import { test, expect } from "@playwright/test";

// Admin bulk + fraud endpoints (spec section 17/26): guarded for anonymous users.
test.describe("admin bulk and fraud guards", () => {
  test("bulk API rejects anonymous callers", async ({ request }) => {
    const res = await request.post("/api/admin/bulk", { data: { command: "activate", productIds: ["x"] } });
    expect([401, 403]).toContain(res.status());
  });

  test("fraud queue is admin-only", async ({ request }) => {
    const res = await request.get("/api/admin/fraud-queue");
    expect([401, 403]).toContain(res.status());
  });

  test("digest requires an admin session", async ({ request }) => {
    const res = await request.get("/api/admin/digest");
    expect([401, 403]).toContain(res.status());
  });

  test("destructive commands are never accepted without auth", async ({ request }) => {
    const res = await request.post("/api/admin/bulk", { data: { command: "delete", productIds: ["x", "y"] } });
    expect([401, 403]).toContain(res.status());
    expect(res.ok()).toBeFalsy();
  });
});
