import { describe, expect, it } from "vitest";
import { scoreMatch, suggestions, tokenize } from "@/lib/search/tokenize";

const catalog = [
  { title: "Wireless Earbuds Pro" },
  { title: "Wireless Charging Pad" },
  { title: "USB-C Cable 2m" },
  { title: "Standing Desk Converter" }
];

describe("search tokenize", () => {
  it("splits queries into lowercase tokens", () => {
    expect(tokenize("Wireless EAR-buds!")).toEqual(["wireless", "ear", "buds"]);
    expect(tokenize("  ")).toEqual([]);
  });
  it("scores title matches above description matches", () => {
    const s = scoreMatch("Wireless Earbuds Pro", "a charging pad", tokenize("wireless"));
    expect(s).toBeGreaterThanOrEqual(2);
  });
  it("suggests matching titles, best first", () => {
    const s = suggestions("wireless", catalog, 5);
    expect(s.length).toBe(2);
    expect(s[0]).toBe("Wireless Earbuds Pro"); // starts-with scores 3
  });
  it("returns nothing for junk queries", () => {
    expect(suggestions("zzz", catalog)).toEqual([]);
  });
});
