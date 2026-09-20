import { describe, expect, it } from "vitest";
import { slugify, uniqueSlug } from "@/lib/slugify";

describe("slugify", () => {
  it("makes URL-safe slugs", () => {
    expect(slugify("Hello World!")).toBe("hello-world");
    expect(slugify("10\" Kitchen Knife (Set of 3)")).toBe("10-kitchen-knife-set-of-3");
  });
  it("strips accents and trims separators", () => {
    expect(slugify("Café Décor -- Special")).toBe("cafe-decor-special");
    expect(slugify("---already---")).toBe("already");
  });
  it("caps length at 80", () => {
    expect(slugify("a".repeat(120)).length).toBe(80);
  });
  it("uniquifies against taken slugs", () => {
    expect(uniqueSlug("chair", ["chair"])).toBe("chair-2");
    expect(uniqueSlug("chair", ["chair", "chair-2"])).toBe("chair-3");
    expect(uniqueSlug("table", ["chair"])).toBe("table");
  });
});
