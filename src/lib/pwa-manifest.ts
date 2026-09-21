// PWA manifest builder (spec section 2): installable storefront.
export type ManifestInput = {
  name: string; shortName: string; themeColor: string; backgroundColor: string;
  baseUrl: string; icon192?: string; icon512?: string;
};

export function buildManifest(input: ManifestInput): Record<string, unknown> {
  const base = input.baseUrl.replace(/\/+$/, "");
  return {
    name: input.name,
    short_name: input.shortName,
    description: "Omni Cart - quality products, fast shipping in the US and UK.",
    start_url: `${base}/`,
    display: "standalone",
    background_color: input.backgroundColor,
    theme_color: input.themeColor,
    icons: [
      { src: input.icon192 ?? `${base}/icon-192.png`, sizes: "192x192", type: "image/png" },
      { src: input.icon512 ?? `${base}/icon-512.png`, sizes: "512x512", type: "image/png" }
    ],
    shortcuts: [
      { name: "Shop", url: `${base}/shop` },
      { name: "Track order", url: `${base}/track-order` },
      { name: "Cart", url: `${base}/cart` }
    ]
  };
}
