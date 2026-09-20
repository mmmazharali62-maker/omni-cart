import { describe, expect, it } from "vitest";
import { estimatedDelivery, formatWindow, optionPrice, SHIPPING_OPTIONS } from "@/lib/shipping/estimates";

describe("shipping estimates", () => {
  it("prices options per currency", () => {
    expect(optionPrice(SHIPPING_OPTIONS[0], "USD")).toBe(599);
    expect(optionPrice(SHIPPING_OPTIONS[0], "GBP")).toBe(499);
  });
  it("formats the delivery window", () => {
    expect(formatWindow(SHIPPING_OPTIONS[1])).toBe("3-7 business days");
  });
  it("estimates delivery windows including supplier lead time", () => {
    const from = new Date("2026-01-05T10:00:00Z"); // Monday
    const { from: lo, to: hi } = estimatedDelivery("express", 2, from);
    expect(lo.getDay()).not.toBe(0); // never Sunday
    expect(hi.getTime()).toBeGreaterThan(lo.getTime());
  });
  it("express is faster than standard", () => {
    const base = new Date("2026-01-05T10:00:00Z");
    const express = estimatedDelivery("express", 0, base);
    const standard = estimatedDelivery("standard", 0, base);
    expect(express.to.getTime()).toBeLessThan(standard.to.getTime());
  });
});
