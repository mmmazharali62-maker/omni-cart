import { describe, expect, it } from "vitest";
import { adjustedPrice, bulkActionSchema, requiresOwnerRole, validateBulkAction } from "@/lib/bulk-actions";

describe("bulk actions", () => {
  it("validates command shapes", () => {
    expect(bulkActionSchema.safeParse({ command: "activate", productIds: ["a"] }).success).toBe(true);
    expect(bulkActionSchema.safeParse({ command: "explode", productIds: ["a"] }).success).toBe(false);
    expect(bulkActionSchema.safeParse({ command: "delete", productIds: [] }).success).toBe(false);
  });
  it("requires params per command", () => {
    expect(validateBulkAction({ command: "adjust-price", productIds: ["a"] })).toContain("adjustPct");
    expect(validateBulkAction({ command: "reassign-supplier", productIds: ["a"] })).toContain("supplierId");
    expect(validateBulkAction({ command: "activate", productIds: ["a"], adjustPct: 5 })).toContain("not valid");
    expect(validateBulkAction({ command: "activate", productIds: ["a"] })).toBeNull();
  });
  it("gates destructive commands", () => {
    expect(requiresOwnerRole("delete")).toBe(true);
    expect(requiresOwnerRole("export")).toBe(false);
  });
  it("adjusts prices with rounding", () => {
    expect(adjustedPrice(19.99, 10)).toBe(21.99);
    expect(adjustedPrice(100, -25)).toBe(75);
  });
});
