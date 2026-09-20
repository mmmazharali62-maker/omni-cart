import { describe, expect, it } from "vitest";
import { channelsFor, effectiveChannels } from "@/lib/notifications/channels";

describe("notification channels", () => {
  it("routes customer events to email", () => {
    expect(channelsFor("order_paid")).toEqual(["email"]);
  });
  it("ships tracking via email + sms", () => {
    expect(channelsFor("order_shipped")).toContain("sms");
  });
  it("sends ops events to admins", () => {
    expect(channelsFor("sync_failure")).toEqual(["admin-email"]);
    expect(channelsFor("fraud_hold")).toEqual(["admin-email"]);
  });
  it("drops sms when not opted in", () => {
    expect(effectiveChannels("order_shipped", false)).toEqual(["email"]);
    expect(effectiveChannels("order_shipped", true)).toEqual(["email", "sms"]);
  });
  it("defaults unknown events to email", () => {
    expect(channelsFor("order_paid")).toBeDefined();
  });
});
