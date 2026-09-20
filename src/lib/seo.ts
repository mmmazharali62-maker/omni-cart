// SEO helpers (spec section 23): metadata + Product structured data (schema.org).
export function productStructuredData(product: {
  title: string;
  slug: string;
  description: string;
  images: string[];
  basePrice: { toNumber(): number };
  currency: string;
  reviews?: Array<{ rating: number }>;
}) {
  const avg = product.reviews?.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images,
    offers: {
      "@type": "Offer",
      price: product.basePrice.toNumber().toFixed(2),
      priceCurrency: product.currency,
      availability: "https://schema.org/InStock"
    },
    ...(avg != null
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avg.toFixed(1),
            reviewCount: product.reviews!.length
          }
        }
      : {})
  };
}

export function openGraphMetadata(title: string, description: string, url: string, image?: string) {
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: image ? [{ url: image }] : undefined,
      type: "website" as const
    },
    twitter: { card: "summary_large_image" as const, title, description }
  };
}
