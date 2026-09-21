import { describe, expect, it } from "vitest";
import { buildManifest } from "@/lib/pwa-manifest";

describe("pwa manifest", () => {
  it("builds an installable manifest", () => {
    const m = buildManifest({
      name: "Omni Cart", shortName: "OmniCart", themeColor: "#7c3aed",
      backgroundColor: "#0b0b12", baseUrl: "https://omnicart.example.com/"
    }) as Record<string, any>;
    expect(m.name).toBe("Omni Cart");
    expect(m.short_name).toBe("OmniCart");
    expect(m.start_url).toBe("https://omnicart.example.com/");
    expect(m.display).toBe("standalone");
    expect(m.icons).toHaveLength(2);
  });
  it("includes app shortcuts with clean urls", () => {
    const m = buildManifest({ name: "X", shortName: "X", themeColor: "#000", backgroundColor: "#000", baseUrl: "https://x.com//" }) as Record<string, any>;
    expect(m.shortcuts[0].url).toBe("https://x.com/shop");
  });
});
