import { describe, expect, it } from "vitest";
import { canMerge, claimableOrders, mergePriority, type MergeableOrder } from "@/lib/orders/merge";

const order = (over: Partial<MergeableOrder>): MergeableOrder => ({
  id: "o", userId: null, guestEmail: "Guest@Mail.com", status: "DELIVERED", createdAt: "2026-09-01", ...over
});

describe("guest order merge", () => {
  it("claims guest orders by email", () => {
    const list = [order({ id: "mine" }), order({ id: "other", guestEmail: "someone@else.com" }), order({ id: "taken", userId: "u2" })];
    expect(claimableOrders(list, "guest@mail.com").map((o) => o.id)).toEqual(["mine"]);
  });
  it("never merges orders owned by someone else", () => {
    expect(canMerge(order({ userId: "u2" }), "guest@mail.com")).toBe(false);
    expect(canMerge(order({ guestEmail: "other@x.com" }), "guest@mail.com")).toBe(false);
    expect(canMerge(order({}), "guest@mail.com")).toBe(true);
  });
  it("prioritizes newest first", () => {
    const sorted = mergePriority([order({ id: "old", createdAt: "2026-01-01" }), order({ id: "new", createdAt: "2026-09-01" })]);
    expect(sorted[0].id).toBe("new");
  });
});
