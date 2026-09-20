import { describe, expect, it } from "vitest";
import { renderPasswordReset } from "@/lib/notifications/templates/password-reset";

describe("password-reset template", () => {
  it("includes the reset link and default expiry", () => {
    const t = renderPasswordReset({ resetUrl: "https://omnicart.com/reset?token=abc" });
    expect(t.body).toContain("https://omnicart.com/reset?token=abc");
    expect(t.body).toContain("60 minutes");
    expect(t.body).toContain("safely ignore");
  });
  it("honours a custom expiry", () => {
    const t = renderPasswordReset({ resetUrl: "https://x/reset", expiresInMinutes: 15 });
    expect(t.body).toContain("15 minutes");
  });
});
