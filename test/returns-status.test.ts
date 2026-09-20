import { describe, expect, it } from "vitest";
import { canTransition, RETURN_STATUSES } from "@/lib/returns/status";

describe("return status machine", () => {
  it("follows the happy path", () => {
    expect(canTransition("requested", "approved")).toBe(true);
    expect(canTransition("approved", "received")).toBe(true);
    expect(canTransition("received", "refunded")).toBe(true);
  });
  it("can reject early but not late", () => {
    expect(canTransition("requested", "rejected")).toBe(true);
    expect(canTransition("received", "rejected")).toBe(true);
    expect(canTransition("refunded", "rejected")).toBe(false);
  });
  it("blocks illegal jumps and reversals", () => {
    expect(canTransition("requested", "refunded")).toBe(false);
    expect(canTransition("refunded", "requested")).toBe(false);
    expect(canTransition("cancelled", "approved")).toBe(false);
  });
  it("rejects unknown statuses", () => {
    expect(canTransition("unknown", "approved")).toBe(false);
    expect(RETURN_STATUSES).toContain("cancelled");
  });
});
