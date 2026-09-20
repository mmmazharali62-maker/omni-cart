import { describe, expect, it } from "vitest";
import { generateShareToken, isValidShareToken, shareUrl, viewLimitReached } from "@/lib/wishlist-sharing";

describe("wishlist sharing", () => {
  it("generates 24-char lowercase tokens", () => {
    const t = generateShareToken();
    expect(t).toMatch(/^[a-z0-9]{24}$/);
  });
  it("validates token shape", () => {
    expect(isValidShareToken(generateShareToken())).toBe(true);
    expect(isValidShareToken("short")).toBe(false);
    expect(isValidShareToken("ABCDEF")).toBe(false);
  });
  it("builds clean share URLs", () => {
    expect(shareUrl("https://omnicart.com/", "tok".padEnd(24, "x")))
      .toBe("https://omnicart.com/wishlist/shared/" + "tok".padEnd(24, "x"));
  });
  it("caps views per token", () => {
    expect(viewLimitReached(199)).toBe(false);
    expect(viewLimitReached(200)).toBe(true);
  });
});
