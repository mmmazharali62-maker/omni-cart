import { describe, expect, it } from "vitest";
import { CARRIERS, detectCarrier, trackingUrl } from "@/lib/shipping/carriers";

describe("carriers", () => {
  it("detects UPS by shape", () => {
    expect(detectCarrier("1Z999AA10123456784")).toBe("ups");
    expect(detectCarrier("9400111899560000000000")).not.toBe("ups"); // usps prefix
  });
  it("detects USPS tracking prefixes", () => {
    expect(detectCarrier("9400111899223197428490")).toBe("usps");
  });
  it("detects Royal Mail GB numbers", () => {
    expect(detectCarrier("AB123456789GB")).toBe("royal-mail");
  });
  it("falls back to other", () => {
    expect(detectCarrier("ZZZ999")).toBe("other");
  });
  it("builds tracking URLs with the number encoded", () => {
    const url = trackingUrl("ups", "1Z ABC 123");
    expect(url).toContain(encodeURIComponent("1Z ABC 123"));
    expect(url).toContain("ups.com");
  });
  it("exposes US and UK carriers", () => {
    expect(CARRIERS.usps.region).toBe("US");
    expect(CARRIERS["royal-mail"].region).toBe("UK");
  });
});
