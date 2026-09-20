# Deployment Guide

## 1. Database

Create a Postgres (Neon/Supabase free tier works) and set `DATABASE_URL`.

```bash
npx prisma migrate deploy
```

## 2. Environment variables

Set these on the platform (never commit them):

| Variable | Notes |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `NEXTAUTH_URL` | Final public URL |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `INTEGRATIONS_MASTER_KEY` | Encrypts admin-entered API keys |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for SEO/sitemap |

Payments, suppliers, email, and SMS keys can be **added later from the
Integrations admin page** - see [integrations/](integrations/README.md).

## 3. Build

```bash
npm run build
npm start
```

Works on Vercel out of the box; any Node host also works.

## 4. Webhooks

Register after the first deploy (URLs show on each Integrations page):
- Stripe: `/api/webhooks/stripe`
- CJ: `/api/webhooks/cj` (header `x-omni-webhook-token`)
- AliExpress: `/api/webhooks/aliexpress`

## 5. Post-deploy checklist

- [ ] `/api/health` returns `{"status":"ok"}`
- [ ] Home, shop, and product pages render
- [ ] Test Stripe checkout in test mode
- [ ] Place one end-to-end order and refund it
- [ ] `curl your-domain/sitemap.xml` returns URLs
- [ ] Admin → Integrations shows your credentials as "Ready"

## Rollbacks

Deployments are stateless; the only state is Postgres. To roll back an app
release, redeploy the previous build - migrations are forward-only by design.
