import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { MemoryCache } from "@/lib/cache";

describe("memory cache", () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it("stores and returns values", () => {
    const c = new MemoryCache();
    c.set("k", { a: 1 });
    expect(c.get<{ a: number }>("k")).toEqual({ a: 1 });
    expect(c.get("missing")).toBeNull();
  });
  it("expires entries after the TTL", () => {
    const c = new MemoryCache();
    c.set("k", "v", 1000);
    vi.advanceTimersByTime(1500);
    expect(c.get("k")).toBeNull();
  });
  it("invalidates by tag", () => {
    const c = new MemoryCache();
    c.set("a", 1, 60_000, ["products"]);
    c.set("b", 2, 60_000, ["orders"]);
    expect(c.invalidateTag("products")).toBe(1);
    expect(c.get("a")).toBeNull();
    expect(c.get("b")).toBe(2);
  });
  it("clear() empties everything", () => {
    const c = new MemoryCache();
    c.set("a", 1); c.set("b", 2);
    c.clear();
    expect(c.size).toBe(0);
  });
});
