import { describe, expect, it } from "vitest";
import { createUnsubscribeToken, unsubscribeCopy, verifyUnsubscribeToken } from "@/lib/notifications/unsubscribe";

const SECRET = "test-secret";

describe("unsubscribe tokens", () => {
  it("round-trips a valid token", () => {
    const token = createUnsubscribeToken("Reader@Example.com", "marketing", SECRET);
    const payload = verifyUnsubscribeToken(token, SECRET);
    expect(payload?.email).toBe("reader@example.com");
    expect(payload?.scope).toBe("marketing");
  });
  it("rejects tampered tokens and wrong secrets", () => {
    const token = createUnsubscribeToken("a@b.com", "all", SECRET);
    expect(verifyUnsubscribeToken(token, "other-secret")).toBeNull();
    expect(verifyUnsubscribeToken(token.slice(0, -2) + "zz", SECRET)).toBeNull();
    expect(verifyUnsubscribeToken("garbage", SECRET)).toBeNull();
  });
  it("expires after 30 days", () => {
    const old = createUnsubscribeToken("a@b.com", "all", SECRET, Date.now() - 31 * 86_400_000);
    expect(verifyUnsubscribeToken(old, SECRET)).toBeNull();
  });
  it("provides bilingual confirm copy", () => {
    expect(unsubscribeCopy("en-GB").title).toBeTruthy();
    expect(unsubscribeCopy("en-US").confirm).toContain("Transactional");
  });
});
