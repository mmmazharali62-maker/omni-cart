import { describe, expect, it } from "vitest";
import { alreadyReferred, generateReferralCode, isValidReferralCode, referralEligible, referralShareUrl, REFEREE_MIN_ORDER_CENTS } from "@/lib/referrals";

describe("referrals", () => {
  it("generates readable codes", () => {
    const code = generateReferralCode(() => 0.5);
    expect(code).toMatch(/^REF-[A-Z0-9]{8}$/);
    expect(code).not.toMatch(/[IO01]/);
    expect(isValidReferralCode(code)).toBe(true);
    expect(isValidReferralCode("REF-abcd")).toBe(false);
  });
  it("rewards only on delivered orders above the minimum", () => {
    expect(referralEligible("DELIVERED", REFEREE_MIN_ORDER_CENTS)).toBe(true);
    expect(referralEligible("DELIVERED", 999)).toBe(false);
    expect(referralEligible("SHIPPED", 10_000)).toBe(false);
  });
  it("detects already-referred emails case-insensitively", () => {
    expect(alreadyReferred("New@Email.com", ["new@email.com"])).toBe(true);
    expect(alreadyReferred("fresh@x.com", ["other@x.com"])).toBe(false);
  });
  it("builds share urls without double slashes", () => {
    expect(referralShareUrl("https://omnicart.com/", "REF-ABCD2345")).toBe("https://omnicart.com/?ref=REF-ABCD2345");
  });
});
