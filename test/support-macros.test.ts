import { describe, expect, it } from "vitest";
import { isSafeToPrefill, MACROS, macro } from "@/lib/support/macros";

describe("support macros", () => {
  it("finds macros by id", () => {
    expect(macro("where-order")?.label).toBe("Where is my order?");
    expect(macro("nope")).toBeUndefined();
  });
  it("every macro has usable copy", () => {
    for (const m of MACROS) {
      expect(m.body.length).toBeGreaterThan(40);
      expect(m.label.length).toBeGreaterThan(3);
    }
  });
  it("only prefills while a ticket is actionable", () => {
    expect(isSafeToPrefill("open")).toBe(true);
    expect(isSafeToPrefill("pending")).toBe(true);
    expect(isSafeToPrefill("closed")).toBe(false);
  });
});
