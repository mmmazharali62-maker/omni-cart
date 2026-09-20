# Omni Cart - Documentation

Dropshipping storefront for US + UK: Liquid Glass UI, automated fulfillment,
CJ/AliExpress/Amazon supplier integrations, Stripe checkout.

## Start here

| Guide | What it covers |
|---|---|
| [integrations/](integrations/README.md) | Adding credentials later: database, Stripe, CJ, AliExpress, Amazon, email, SMS |
| [testing.md](testing.md) | Unit tests (Vitest) and E2E tests (Playwright) |
| [deployment.md](deployment.md) | Going live: env vars, migrations, webhooks |
| [returns-and-refunds.md](returns-and-refunds.md) | How the 30-day return system works |

## Architecture at a glance

- **Next.js (App Router) + TypeScript + Prisma + Postgres**
- `src/lib/` - business logic (pricing engine, fulfillment, tax, returns,
  supplier sync, integrations, fraud checks, loyalty, search)
- `src/app/(customer)/` - storefront routes; `src/app/(admin)/admin/` - ops center
- `src/app/api/` - validated (Zod) API routes; `src/lib/jobs/` - background syncs
- `test/` - unit tests; `e2e/` - Playwright specs

## Commands

```bash
npm run dev            # local dev server
npx prisma migrate dev # apply schema changes
npm run test           # unit tests (48+ suites)
npm run test:e2e       # E2E (needs a running app)
npx tsc --noEmit       # typecheck
```

## Conventions

- No secrets in code - everything through the Integrations admin or env vars.
- Every admin write goes through `requireAdmin` and lands in `AuditLog`.
- Pure business logic lives in `src/lib` with unit tests; UI stays thin.
