import { describe, expect, it } from "vitest";
import { rateFor, zoneFor, ZONE_RATES } from "@/lib/shipping/zones";

describe("shipping zones", () => {
  it("maps US lower-48 addresses", () => {
    expect(zoneFor("US", "94105")).toBe("us-lower");
    expect(zoneFor("US", "10001")).toBe("us-lower");
  });
  it("maps Alaska/Hawaii to the remote zone", () => {
    expect(zoneFor("US", "99501")).toBe("us-ak-hi");
    expect(zoneFor("US", "96801")).toBe("us-ak-hi");
  });
  it("maps UK mainland vs highlands", () => {
    expect(zoneFor("GB", "SW1A 1AA")).toBe("uk-mainland");
    expect(zoneFor("GB", "IV1 1AA")).toBe("uk-highlands");
  });
  it("prices zones differently", () => {
    expect(rateFor("us-lower", "standard")).toBe(599);
    expect(rateFor("uk-highlands", "express")).toBeGreaterThan(ZONE_RATES["uk-mainland"].expressCents);
  });
});
