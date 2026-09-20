import { describe, it, expect } from "vitest";
import { canTransition } from "@/lib/orders/state-machine";

describe("order state machine", () => {
  it("follows the happy path", () => {
    const path = ["PENDING", "PAID", "PROCESSING", "FULFILLED", "SHIPPED", "IN_TRANSIT", "DELIVERED"] as const;
    for (let i = 0; i < path.length - 1; i++) {
      expect(canTransition(path[i], path[i + 1])).toBe(true);
    }
  });

  it("blocks illegal jumps", () => {
    expect(canTransition("PENDING", "DELIVERED")).toBe(false);
    expect(canTransition("DELIVERED", "PAID")).toBe(false);
  });

  it("allows the retry path from FAILED", () => {
    expect(canTransition("FAILED", "PENDING")).toBe(true);
  });
});
