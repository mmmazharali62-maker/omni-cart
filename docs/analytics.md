# Analytics Guide

What to watch, where to find it, and what "good" looks like.

## Dashboards (Admin)

- **Analytics**: revenue, orders, conversion funnel, top products.
- **Digest**: rolling 24h summary with warnings; also emailed each morning.
- **Supplier Health**: reliability scores per supplier (auto-routing gate).
- **Fraud Review**: flagged orders needing a human decision.
- **Exports**: invoice CSV, revenue by month, tax by region.

## The funnel (`src/lib/funnel.ts`)

```
shop views -> product views -> add to cart -> checkout -> paid
```

- Biggest single leak shows first (it's usually product -> cart).
- Fix order: price clarity, shipping cost visibility, trust badges,
  reviews. One change at a time, watch the digest for a week.

## Benchmarks (ecommerce typicals)

- Product view -> add to cart: 8-12%
- Cart -> checkout: 40-60%
- Checkout -> paid: 60-80%
- Overall shop view -> paid: 2-4%

Below those, check the funnel step's biggest drop-off first.

## Metrics definitions

- **Revenue**: paid orders only (PAID, PROCESSING, SHIPPED, DELIVERED).
- **Conversion**: paid / shop views, rolling 24h window in the digest.
- **Supplier on-time**: shipped within promised lead time window.
- **Defect rate**: supplier-fault returns (reason codes) / fulfilled items.

## Data hygiene

- Events are anonymous; PII never leaves the order tables.
- Analytics reads never mutate data (pure functions, unit-tested).
- Exports contain customer emails - handle per the privacy policy.
