import { describe, expect, it } from "vitest";
import { generateOrderNumber, isValidOrderNumber } from "@/lib/orders/numbers";

describe("order numbers", () => {
  it("matches the OC-YYMM-XXXXX format", () => {
    const n = generateOrderNumber(new Date("2026-09-20"), () => 0.5);
    expect(n).toMatch(/^OC-2609-/);
  });
  it("valid numbers pass the checksum", () => {
    for (let i = 0; i < 50; i++) {
      const n = generateOrderNumber();
      expect(isValidOrderNumber(n)).toBe(true);
    }
  });
  it("tampered numbers fail the checksum", () => {
    const n = generateOrderNumber();
    const tampered = n.slice(0, 10) + (n[10] === "A" ? "B" : "A");
    expect(isValidOrderNumber(tampered)).toBe(false);
    expect(isValidOrderNumber("OC-1234-ABCDE")).toBe(false);
    expect(isValidOrderNumber("garbage")).toBe(false);
  });
});
