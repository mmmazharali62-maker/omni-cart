# Testing Guide

Two layers: fast unit tests for logic, E2E tests for user journeys.

## Unit tests (Vitest)

```bash
npm run test          # watch mode
npm run test -- run   # single pass (CI)
```

- Location: `test/*.test.ts`
- Config: `vitest.config.ts` (resolves `@/` to `src/`, node environment)
- Current status: 85+ tests across 25+ suites, all green.

What's covered: pricing engine, cart totals, validation, fulfillment,
state machines, tax (US/UK), currency, carriers, returns policy + status
machine, supplier health, funnel analytics, import normalization/gates,
sanitization, sitemap, search tokenization, order numbers, loyalty,
fraud heuristics, cache, i18n, integrations (encryption, catalog, masking).

**Rules for new code:** pure logic goes in `src/lib` with tests. DB-free
functions only - mock at the route level if needed.

## E2E tests (Playwright)

```bash
npx playwright install      # once, per machine
npm run test:e2e
```

- Location: `e2e/*.spec.ts`, shared fixtures in `e2e/fixtures/`
- Config: `playwright.config.ts` (chromium first; retries on CI)
- Requires: a dev server + a seeded database (see `prisma/seed`).

Covered journeys: shop search/filter/sort, product page + reviews, cart
quantity rules, checkout flow, auth, returns, tracking lookup, and the admin
integrations guard (including that APIs never leak secrets).

**Selectors:** prefer roles and labels (`getByRole`, `getByLabel`) over CSS
selectors - they survive refactors.
