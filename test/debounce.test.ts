import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { debounce, throttle } from "@/lib/debounce";

describe("debounce/throttle", () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it("debounces rapid calls into one", () => {
    const fn = vi.fn();
    const d = debounce(fn, 100);
    d(); d(); d();
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(150);
    expect(fn).toHaveBeenCalledTimes(1);
  });
  it("cancel prevents execution", () => {
    const fn = vi.fn();
    const d = debounce(fn, 100);
    d();
    d.cancel();
    vi.advanceTimersByTime(150);
    expect(fn).not.toHaveBeenCalled();
  });
  it("throttle fires at most once per window", () => {
    const fn = vi.fn();
    const t = throttle(fn, 100);
    t(); t(); t();
    expect(fn).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(150);
    t();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
