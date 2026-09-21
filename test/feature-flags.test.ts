import { describe, expect, it } from "vitest";
import { DEFAULT_FLAGS, isEnabled, rolloutSlot } from "@/lib/feature-flags";

describe("feature flags", () => {
  it("respects enabled + rollout", () => {
    const flags = [{ key: "t", description: "", enabled: true, rolloutPct: 50, audience: "all" as const }];
    expect(isEnabled(flags, "t", 50)).toBe(true);
    expect(isEnabled(flags, "t", 51)).toBe(false);
    expect(isEnabled(flags, "t", 100)).toBe(false); // 100 > 50 rollout
  });
  it("off flags never enable", () => {
    const flags = [{ key: "off", description: "", enabled: false, rolloutPct: 100, audience: "all" as const }];
    expect(isEnabled(flags, "off", 1)).toBe(false);
  });
  it("staff-only flags stay off publicly", () => {
    const flags = [{ key: "staff-only", description: "", enabled: true, rolloutPct: 100, audience: "staff" as const }];
    expect(isEnabled(flags, "staff-only", 1)).toBe(false);
  });
  it("rollout slots are stable per visitor", () => {
    expect(rolloutSlot("v-abcd-1234-x")).toBe(rolloutSlot("v-abcd-1234-x"));
    expect(rolloutSlot("v-abcd-1234-x")).toBeLessThanOrEqual(100);
    expect(rolloutSlot("v-abcd-1234-x")).toBeGreaterThanOrEqual(1);
  });
  it("ships a sane default set", () => {
    expect(DEFAULT_FLAGS.length).toBeGreaterThan(3);
    expect(DEFAULT_FLAGS.every((f) => f.key && f.description)).toBe(true);
  });
});
