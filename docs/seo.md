# SEO Guide

How Omni Cart earns organic traffic in the US and UK.

## Foundations (already built)

- Unique `<title>` + meta description per page via `src/lib/seo-meta.ts`.
- JSON-LD structured data (`src/lib/json-ld.ts`): Product, Offer, BreadcrumbList.
- `sitemap.xml` generation (`src/lib/sitemap.ts`): submit in Google Search Console.
- Clean slugs (`src/lib/slugify.ts`): `wireless-earbuds-pro`, never ids.
- Canonical URLs and `robots` handled at the layout level.

## Product pages

- Title formula: `{Product} - {Key benefit} | Omni Cart`.
- Descriptions: 150+ words, real specs, no supplier boilerplate
  (`src/lib/import/normalize.ts` strips "hot sale / free shipping" junk).
- Alt text on every image; first image is the hero.
- Freshness: stock and price updates count as content updates - sync jobs do this.

## Content pages

- `/about`, `/faq`, `/shipping-policy`, `/refund-policy`, `/privacy`, `/terms`,
  `/contact`: trust pages that also win long-tail queries.
- FAQs use schema-friendly markup; answer the real questions support gets.

## Keywords

- `src/lib/keywords.ts` extracts keyword candidates from product copy.
- Target one primary keyword per page; the rest go in headings/FAQ.
- US vs UK spellings: colour/color, favourites/favorites - both markets get
  native copy via `src/lib/i18n.ts`.

## Technical hygiene

- Keep pages under 3s LCP: images are next/image optimized, lists paginated.
- No thin pages: out-of-stock products redirect to their category.
- The 30-day refund policy and reviews (schema) boost click-through.
