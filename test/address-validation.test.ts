import { describe, expect, it } from "vitest";
import { addressSchema, formatAddress } from "@/lib/address-validation";

const base = { fullName: "Jane Doe", line1: "1 Main St", city: "London", postalCode: "SW1A 1AA", country: "GB" } as const;

describe("address validation", () => {
  it("accepts valid UK postcodes", () => {
    expect(addressSchema.safeParse(base).success).toBe(true);
  });
  it("rejects US-style zip for GB", () => {
    expect(addressSchema.safeParse({ ...base, postalCode: "90210" }).success).toBe(false);
  });
  it("accepts valid US zips", () => {
    const us = { ...base, postalCode: "90210", country: "US", city: "Beverly Hills" };
    expect(addressSchema.safeParse(us).success).toBe(true);
  });
  it("formats a one-line address", () => {
    expect(formatAddress({ ...base, state: undefined })).toContain("1 Main St");
  });
});
