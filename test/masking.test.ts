import { describe, expect, it } from "vitest";
import { maskSecret } from "@/lib/integrations/status";

describe("secret masking", () => {
  it("hides the middle of long secrets", () => {
    const masked = maskSecret("sk_live_51H8xYzABCDEFGH");
    expect(masked.startsWith("sk_l")).toBe(true);
    expect(masked.endsWith("GH")).toBe(true);
    expect(masked).not.toContain("51H8xYz");
  });
  it("fully masks short values", () => {
    expect(maskSecret("abc12")).toBe("•••••");
    expect(maskSecret("")).toBe("");
  });
  it("never exposes more than 4 leading chars", () => {
    expect(maskSecret("1234567890")).toBe(`1234${"•".repeat(4)}90`);
  });
});
