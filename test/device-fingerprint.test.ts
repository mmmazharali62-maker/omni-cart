import { describe, expect, it } from "vitest";
import { countryMismatch, fingerprint, isSharedDevice } from "@/lib/security/device-fingerprint";

describe("device fingerprints", () => {
  const hints = { userAgent: "Mozilla/5.0 (Mac)", language: "en-US", timezone: "America/Los_Angeles", screenWidth: 1920, screenHeight: 1080 };

  it("is stable for the same device", () => {
    expect(fingerprint(hints)).toBe(fingerprint({ ...hints }));
  });
  it("changes when the device hints change", () => {
    expect(fingerprint(hints)).not.toBe(fingerprint({ ...hints, timezone: "Europe/London" }));
    expect(fingerprint(hints)).toMatch(/^fp_[a-z0-9]+$/);
  });
  it("flags shared devices", () => {
    expect(isSharedDevice(2)).toBe(false);
    expect(isSharedDevice(3)).toBe(true);
  });
  it("detects account/checkout country mismatches", () => {
    expect(countryMismatch("GB", "US")).toBe(true);
    expect(countryMismatch("US", "US")).toBe(false);
    expect(countryMismatch("", "US")).toBe(false);
  });
});
