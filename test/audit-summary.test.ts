import { describe, expect, it } from "vitest";
import { actionBreakdown, failedActionRate, suspiciousActors, type AuditEntry } from "@/lib/audit-summary";

const entry = (action: string, actor: string, success = true): AuditEntry => ({
  id: `${action}-${actor}-${Math.random()}`, action, actor, createdAt: new Date().toISOString(), success
});

describe("audit summary", () => {
  it("breaks actions down by count", () => {
    const b = actionBreakdown([entry("LOGIN", "a"), entry("LOGIN", "b"), entry("EXPORT", "a")]);
    expect(b[0]).toEqual({ action: "LOGIN", count: 2 });
  });
  it("computes the failure rate", () => {
    expect(failedActionRate([entry("X", "a", true), entry("X", "a", false)])).toBe(50);
    expect(failedActionRate([])).toBe(0);
  });
  it("flags repetitive actors", () => {
    const many = Array.from({ length: 12 }, () => entry("DELETE", "sneaky"));
    const quiet = [entry("LOGIN", "normal"), entry("LOGIN", "normal")];
    expect(suspiciousActors([...many, ...quiet])).toEqual(["sneaky"]);
  });
});
