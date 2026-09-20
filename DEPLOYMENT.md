# Deployment Guide (GitHub -> Vercel -> Production)

## Environments

Vercel gives you three environments out of the box; keep all secrets in
Vercel's project settings, never in the repo:

| Environment | Branch | Use |
|---|---|---|
| Development | local + PR previews | feature work, preview deploys per PR |
| Preview | `preview` / PR | staging with real DB (optional) |
| Production | `main` | live store (UK/USA customers) |

## First production deploy

1. Create a PostgreSQL database (Vercel Postgres, Neon, or Supabase).
2. In Vercel project settings, set the required env vars (see `.env.example`):
   - `DATABASE_URL`, `NEXTAUTH_URL` (your domain), `NEXTAUTH_SECRET`
   - `NEXT_PUBLIC_SITE_URL`
   - later: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, supplier keys, `CRON_SECRET`
3. Deploy `main`. On first deploy, run migrations from your machine or CI:
   `npx prisma migrate deploy`
4. Seed demo data (optional, non-production): `npm run db:seed`
5. Point your custom domain at the Vercel project.

## Webhooks

- Stripe: create a webhook endpoint in the Stripe dashboard pointing at
  `https://yourdomain/api/webhooks/stripe`, subscribe to
  `checkout.session.completed` + `checkout.session.expired`, and store the
  signing secret in `STRIPE_WEBHOOK_SECRET`.

## Cron jobs (automatic sync)

`vercel.json` schedules supplier sync every 6h, tracking updates every 30min,
and order retries hourly. Each `/api/jobs/*` route requires the `x-cron-secret`
header matching `CRON_SECRET`.

## Post-deploy checklist

- [ ] Admin middleware blocks anonymous `/admin` access
- [ ] Stripe test payment moves an order PENDING -> PAID
- [ ] Webhook idempotency verified (replaying an event changes nothing)
- [ ] Sitemap.xml + robots.txt resolve
- [ ] Product structured data passes the Rich Results test
