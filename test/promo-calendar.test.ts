import { describe, expect, it } from "vitest";
import { activePromos, nextPromo, PROMO_CALENDAR } from "@/lib/promo-calendar";

const on = (md: string) => new Date(`2026-${md}T12:00:00Z`);

describe("promo calendar", () => {
  it("activates Black Friday on both markets", () => {
    const us = activePromos(on("11-25"), "US");
    const gb = activePromos(on("11-25"), "GB");
    expect(us[0].id).toBe("black-friday");
    expect(gb.some((p) => p.id === "black-friday")).toBe(true);
  });
  it("keeps market-specific promos local", () => {
    expect(activePromos(on("05-24"), "GB").some((p) => p.id === "memorial")).toBe(false);
    expect(activePromos(on("05-24"), "US").some((p) => p.id === "memorial")).toBe(true);
  });
  it("handles wrap-around windows (New Year)", () => {
    expect(activePromos(on("12-28"), "US").some((p) => p.id === "new-year")).toBe(true);
    expect(activePromos(on("01-01"), "US").some((p) => p.id === "new-year")).toBe(true);
  });
  it("suggests the next promo when quiet", () => {
    const next = nextPromo(on("08-15"), "US");
    expect(next?.id).toBe("black-friday");
  });
  it("covers all calendar ids uniquely", () => {
    const ids = PROMO_CALENDAR.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
