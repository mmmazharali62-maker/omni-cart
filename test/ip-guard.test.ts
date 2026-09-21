import { describe, expect, it } from "vitest";
import { cidrContains, clientIp, isAllowed, ipToInt } from "@/lib/security/ip-guard";

describe("ip guard", () => {
  it("matches cidr ranges", () => {
    expect(cidrContains("192.168.0.0/24", "192.168.0.42")).toBe(true);
    expect(cidrContains("192.168.0.0/24", "192.168.1.42")).toBe(false);
    expect(cidrContains("10.0.0.0/8", "10.99.1.2")).toBe(true);
    expect(cidrContains("0.0.0.0/0", "8.8.8.8")).toBe(true);
  });
  it("rejects garbage", () => {
    expect(ipToInt("999.1.1.1")).toBe(-1);
    expect(ipToInt("abc")).toBe(-1);
    expect(cidrContains("not-a-cidr", "1.2.3.4")).toBe(false);
  });
  it("enforces the allowlist (empty = allow-all)", () => {
    expect(isAllowed(["192.168.0.0/24"], "192.168.0.5")).toBe(true);
    expect(isAllowed(["192.168.0.0/24"], "8.8.8.8")).toBe(false);
    expect(isAllowed([], "8.8.8.8")).toBe(true);
  });
  it("takes the first hop of x-forwarded-for", () => {
    expect(clientIp("203.0.113.7, 10.0.0.1", "127.0.0.1")).toBe("203.0.113.7");
    expect(clientIp(null, "127.0.0.1")).toBe("127.0.0.1");
  });
});
