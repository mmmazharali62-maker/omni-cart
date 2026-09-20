import { describe, expect, it } from "vitest";
import { PROVIDERS, getProviderDef } from "@/lib/integrations/catalog";

describe("integrations catalog", () => {
  it("covers all the required providers", () => {
    const ids = PROVIDERS.map((p) => p.id);
    expect(ids).toEqual(expect.arrayContaining(["database", "stripe", "cj", "aliexpress", "amazon", "email", "sms"]));
  });
  it("has unique provider ids and field names", () => {
    const ids = PROVIDERS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const p of PROVIDERS) {
      const names = p.fields.map((f) => f.name);
      expect(new Set(names).size).toBe(names.length);
    }
  });
  it("every provider has at least one required field and a docs path", () => {
    for (const p of PROVIDERS) {
      expect(p.fields.some((f) => f.required)).toBe(true);
      expect(p.docsPath).toMatch(/^docs\/integrations\//);
    }
  });
  it("looks up single providers", () => {
    expect(getProviderDef("stripe")?.label).toBe("Stripe Payments");
    expect(getProviderDef("nope")).toBeUndefined();
  });
});
