import type { MetadataRoute } from "next";
import { buildManifest } from "@/lib/pwa-manifest";
import { STORE } from "@/lib/config";

// PWA manifest (spec section 2): installable storefront.
export default function manifest(): MetadataRoute.Manifest {
  const manifest = buildManifest({
    name: `${STORE.name} - Quality Products`,
    shortName: STORE.name,
    themeColor: "#7c3aed",
    backgroundColor: "#0b0b12",
    baseUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://omnicart.example.com"
  });
  return manifest as unknown as MetadataRoute.Manifest;
}
