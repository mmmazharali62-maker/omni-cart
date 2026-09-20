import { describe, expect, it } from "vitest";
import { abandonmentEmailPayload, isAbandoned, rankAbandoned } from "@/lib/cart/abandonment";

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();
const base = { items: [{ title: "Lamp", slug: "lamp", quantity: 1, price: 10 }], total: 10, currency: "USD", updatedAt: hoursAgo(30) };

describe("cart abandonment", () => {
  it("flags carts with items, an email, and age past the window", () => {
    expect(isAbandoned({ ...base, email: "a@b.com", updatedAt: hoursAgo(25) })).toBe(true);
  });
  it("ignores fresh, empty, or anonymous carts", () => {
    expect(isAbandoned({ ...base, email: "a@b.com", updatedAt: hoursAgo(2) })).toBe(false);
    expect(isAbandoned({ ...base, items: [], email: "a@b.com", updatedAt: hoursAgo(30) })).toBe(false);
    expect(isAbandoned({ ...base, email: null, updatedAt: hoursAgo(30) })).toBe(false);
  });
  it("ranks by recovery potential (value first)", () => {
    const ranked = rankAbandoned([
      { ...base, email: "x@y.com", updatedAt: hoursAgo(30), total: 10 },
      { ...base, email: "x@y.com", updatedAt: hoursAgo(26), total: 200 }
    ]);
    expect(ranked[0].total).toBe(200);
  });
  it("builds a recovery email payload", () => {
    const p = abandonmentEmailPayload(base);
    expect(p?.subject).toContain("Lamp");
    expect(p?.body).toContain("1x Lamp");
    expect(abandonmentEmailPayload({ ...base, items: [] })).toBeNull();
  });
});
