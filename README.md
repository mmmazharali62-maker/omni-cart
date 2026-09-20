# Omni Cart

A Liquid Glass, 3D-styled dropshipping ecommerce platform targeting **UK & USA**
customers, sourcing from **CJ Dropshipping, AliExpress, and Amazon** (where
legally/contractually supported).

## Stack (initial choice - open to change)

- **Next.js 14 (App Router) + TypeScript** - frontend + backend in one deployable app, Vercel-native.
- **Prisma + PostgreSQL** - database (`prisma/schema.prisma` already models the full domain).
- **NextAuth** - authentication, role-based access (`Customer / Admin / Store Manager / Support / Operations / Fulfillment Manager`).
- **Stripe** - payments, server-side only, secrets via environment variables (never committed).
- **Tailwind CSS** - styling, with a small Liquid Glass design-system layer (`.glass` utility, `GlassPanel`).

## What's in this initial scaffold

- Full folder architecture for every section of the spec: customer storefront,
  admin dashboard, supplier integrations, AI layer, background jobs, webhooks.
- `prisma/schema.prisma`: Users, Customers, Products, Variants, Categories,
  Inventory, Suppliers, SupplierProducts, Orders, OrderItems, Payments,
  Shipments, Tracking, Coupons, Reviews, Addresses, Notifications, Webhooks, AuditLogs.
- Liquid Glass design tokens (`tailwind.config.ts`, `globals.css`) + base
  components (`GlassPanel`, `Button`, `Navbar`, `Footer`).
- Homepage wired to the database with a graceful empty state.
- Every customer route from the spec (shop, categories, deals, new arrivals,
  best sellers, search, wishlist, cart, checkout, account/*, product/[slug], help).
- Every admin route from the spec (dashboard, products, product import,
  suppliers, orders, customers, inventory, pricing, analytics, settings).
- Supplier connector interface (`src/lib/suppliers/types.ts`) implemented by
  CJ Dropshipping / AliExpress / Amazon stubs - swap in real API calls once
  credentials are provisioned (never hard-coded; see `.env.example`).
- Automatic Pricing Engine (`src/lib/pricing-engine.ts`) with unit tests.
- Background job stubs for supplier sync, inventory sync, price sync,
  tracking updates, order retry.
- Webhook handlers for Stripe, CJ Dropshipping, AliExpress with idempotency
  via `WebhookEvent.externalId`.
- AI layer stubs: product content cleanup, recommendations, natural-language
  search, admin assistant.

## What's intentionally still a TODO

This is a large, production-grade platform (spec calls for 30+ feature areas).
This first commit lays down real, working architecture end-to-end rather than
a random 1000-file dump. Next phases (build on request, in this order is
recommended):

1. **Data + auth wiring**: run `prisma migrate`, connect a real Postgres
   instance, finish NextAuth (password hashing, session -> role checks in
   `src/middleware.ts`).
2. **Supplier connectors**: real CJ Dropshipping + AliExpress API calls
   (needs their API credentials/app approval).
3. **Checkout + Stripe**: real Checkout Session creation, webhook-driven order
   state machine, tax/shipping calculation.
4. **Product pages, cart, checkout UI**: full Liquid Glass visual treatment,
   image gallery, variant selection, related products.
5. **Admin dashboard data**: charts, real analytics queries, bulk import UI.
6. **Automatic sync + fulfillment + tracking jobs**: wire the job stubs to a
   scheduler (Vercel Cron or an external queue).
7. **AI layer**: connect a real AI provider for search, recommendations,
   content cleanup, and the admin assistant.
8. **Testing, SEO, notifications, deployment envs.**

## Local development

```bash
npm install
cp .env.example .env
# fill in DATABASE_URL, NEXTAUTH_SECRET at minimum to run locally
npx prisma migrate dev
npm run dev
```

## Deployment

Designed for `GitHub -> Vercel -> Production`, with separate Development /
Preview / Production environments and secrets configured in Vercel, never in
source control.
