import { describe, expect, it } from "vitest";
import { renderLoyaltyMilestone } from "@/lib/notifications/templates/loyalty-milestone";

describe("loyalty-milestone template", () => {
  it("celebrates the new tier and lists perks", () => {
    const t = renderLoyaltyMilestone({ tier: "gold", perks: ["Free returns", "5% birthday discount"], points: 1200 });
    expect(t.subject).toContain("gold");
    expect(t.body).toContain("1200 points");
    expect(t.body).toContain("- Free returns");
    expect(t.body).toContain("- 5% birthday discount");
  });
});
