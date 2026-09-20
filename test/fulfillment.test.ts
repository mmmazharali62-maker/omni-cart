import { describe, it, expect } from "vitest";
import { canTransition } from "@/lib/orders/state-machine";

// fulfillment.ts depends on Prisma at runtime; the pure guard logic it relies on
// is the state machine, already covered in state-machine.test.ts. Here we add
// the specific fulfillment-relevant transitions.
describe("fulfillment transitions", () => {
  it("only fulfills orders that are PAID", () => {
    expect(canTransition("PAID", "PROCESSING")).toBe(true);
    expect(canTransition("PENDING", "PROCESSING")).toBe(false);
    expect(canTransition("DELIVERED", "PROCESSING")).toBe(false);
  });

  it("FAILED can re-enter as PENDING for retry", () => {
    expect(canTransition("FAILED", "PENDING")).toBe(true);
  });

  it("terminal states accept no transitions", () => {
    for (const s of ["CANCELLED", "REFUNDED", "PARTIALLY_REFUNDED"] as const) {
      expect(canTransition(s, "PENDING")).toBe(false);
      expect(canTransition(s, "PAID")).toBe(false);
    }
  });
});
