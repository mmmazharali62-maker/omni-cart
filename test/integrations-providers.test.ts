import { describe, expect, it } from "vitest";
import { PROVIDERS } from "@/lib/integrations/catalog";
import { TESTERS } from "@/lib/integrations";

describe("provider adapters", () => {
  it("has a test-connection adapter for every catalog provider", () => {
    for (const p of PROVIDERS) {
      expect(typeof TESTERS[p.id]).toBe("function");
    }
  });
  it("rejects missing credentials without throwing", async () => {
    for (const id of ["stripe", "cj", "aliexpress", "amazon", "email", "sms"]) {
      const result = await TESTERS[id]({});
      expect(result.ok).toBe(false);
      expect(result.message.length).toBeGreaterThan(0);
    }
  });
});
