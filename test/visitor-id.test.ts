import { describe, expect, it } from "vitest";
import { generateVisitorId, isValidVisitorId } from "@/lib/visitor-id";

describe("visitor ids", () => {
  it("generates valid ids", () => {
    const id = generateVisitorId(() => 0.5);
    expect(isValidVisitorId(id)).toBe(true);
    expect(id).toMatch(/^v-/);
  });
  it("rejects malformed ids", () => {
    expect(isValidVisitorId("nonsense")).toBe(false);
    expect(isValidVisitorId("v-zzzz-yyyy-2026")).toBe(false); // non-hex letters
  });
});
