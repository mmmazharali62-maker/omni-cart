import { describe, expect, it } from "vitest";
import { formatInvoiceNumber, isValidInvoiceNumber, nextSequence, parseInvoiceNumber } from "@/lib/invoice-numbers";

describe("invoice numbers", () => {
  it("formats the INV-YYYYMM-##### series", () => {
    expect(formatInvoiceNumber(2026, 9, 42)).toBe("INV-202609-00042");
  });
  it("validates and parses", () => {
    expect(isValidInvoiceNumber("INV-202609-00042")).toBe(true);
    expect(isValidInvoiceNumber("OC-202609-00042")).toBe(false);
    expect(parseInvoiceNumber("INV-202609-00042")).toEqual({ year: 2026, month: 9, sequence: 42 });
    expect(parseInvoiceNumber("junk")).toBeNull();
  });
  it("sequences past the month's max", () => {
    expect(nextSequence(["INV-202609-00001", "INV-202609-00007"])).toBe(8);
    expect(nextSequence([])).toBe(1);
  });
});
