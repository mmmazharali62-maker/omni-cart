import { describe, expect, it } from "vitest";
import { localeForCountry, stringsFor, t } from "@/lib/i18n";

describe("i18n", () => {
  it("uses British copy for GB", () => {
    expect(t("en-GB", "cart")).toBe("basket");
    expect(t("en-GB", "color")).toBe("colour");
  });
  it("uses American copy for US", () => {
    expect(t("en-US", "cart")).toBe("cart");
    expect(t("en-US", "favorites")).toBe("favorites");
  });
  it("maps countries to locales", () => {
    expect(localeForCountry("GB")).toBe("en-GB");
    expect(localeForCountry("US")).toBe("en-US");
  });
  it("falls back to en-US on unknown locales", () => {
    expect(stringsFor("fr-FR" as never)).toEqual(stringsFor("en-US"));
  });
});
