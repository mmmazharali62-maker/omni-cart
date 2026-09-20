import type { Metadata } from "next";

// Metadata builders (spec section 2): consistent titles/descriptions everywhere.
const SITE = "Omni Cart";

export function pageMeta(title: string, description: string, path?: string): Metadata {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  return {
    title: `${title} | ${SITE}`,
    description,
    ...(url && path ? { alternates: { canonical: `${url}${path}` } } : {})
  };
}

export function productMeta(title: string, description: string, images: string[], path: string): Metadata {
  return {
    ...pageMeta(title, description, path),
    openGraph: {
      title: `${title} | ${SITE}`,
      description,
      images: images.slice(0, 1),
      type: "website"
    }
  };
}
