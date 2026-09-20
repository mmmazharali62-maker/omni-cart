import { describe, expect, it } from "vitest";
import { overallStatus, probe } from "@/lib/health-checks";

describe("health probes", () => {
  it("wraps a passing probe", async () => {
    const r = await probe("db", async () => true);
    expect(r.ok).toBe(true);
  });
  it("captures failures without throwing", async () => {
    const r = await probe("db", async () => { throw new Error("boom"); });
    expect(r.ok).toBe(false);
    expect(r.detail).toContain("boom");
    const r2 = await probe("x", async () => false);
    expect(r2.ok).toBe(false);
  });
  it("grades overall status", () => {
    const ok = [{ name: "a", ok: true, detail: "" }, { name: "b", ok: true, detail: "" }];
    const mixed = [...ok, { name: "c", ok: false, detail: "" }];
    const down = [{ name: "c", ok: false, detail: "" }];
    expect(overallStatus(ok)).toBe("ok");
    expect(overallStatus(mixed)).toBe("degraded");
    expect(overallStatus(down)).toBe("down");
    expect(overallStatus([])).toBe("down");
  });
});
