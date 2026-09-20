# Launch Checklist - Omni Cart

From this repo to a live store in ~30 minutes. Each step needs one thing from you.

## 1. Database (5 min)

1. Create a free Postgres at https://neon.tech (or Supabase).
2. Copy the connection string (it looks like `postgresql://user:pass@host/db?sslmode=require`).
3. Locally: put it in `.env` as `DATABASE_URL=...`, then:

```bash
npm install
npx prisma db push
npm run seed          # demo catalog + admin user
```

## 2. Look at it locally

```bash
npm run dev
# open http://localhost:3000 - shop, cart, checkout all work
# admin: /admin (sign in with the seeded admin: admin@omnicart.com / Admin123!)
```

## 3. Deploy to Vercel (10 min)

1. Push this repo to GitHub (already done).
2. https://vercel.com → Import Project → pick `omni-cart`.
3. Add env vars (Vercel → Settings → Environment Variables):
   - `DATABASE_URL` - from step 1
   - `NEXTAUTH_SECRET` - run: `openssl rand -base64 32`
   - `NEXT_PUBLIC_SITE_URL` - `https://yourdomain.vercel.app`
4. Deploy. Every push to `main` auto-deploys.

## 4. Stripe (10 min) - start taking money

1. https://dashboard.stripe.com → Developers → API keys.
2. Add env vars: `STRIPE_SECRET_KEY`, plus `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
3. Webhooks: Developers → Webhooks → `https://yourdomain/api/webhooks/stripe`,
   events: `checkout.session.completed`, `payment_intent.payment_failed`.
   Put the signing secret in `STRIPE_WEBHOOK_SECRET`.
4. Test with card `4242 4242 4242 4242`.

## 5. Suppliers (whenever ready)

- **CJ Dropshipping**: https://developers.cjdropshipping.com → get API key →
  `CJ_DROPSHIPPING_API_KEY`. One-click import + auto-fulfillment go live.
- **AliExpress**: https://openservice.aliexpress.com → create app →
  `ALIEXPRESS_APP_KEY` + `ALIEXPRESS_APP_SECRET`.
- **Amazon**: Seller Central → SP-API credentials (needs a pro account).

Each key is one env var away - the integration code is already wired.

## 6. Email / SMS (optional but recommended)

- Email: https://resend.com → `EMAIL_PROVIDER_API_KEY` (+ verify your domain for `EMAIL_FROM`).
- SMS: https://twilio.com → `SMS_PROVIDER_ACCOUNT_SID`, `SMS_PROVIDER_AUTH_TOKEN`, `SMS_PROVIDER_FROM_NUMBER`.

## Order of operations

Database first (nothing works without it). Then Vercel. Then Stripe.
Suppliers and email any time after - the store runs fine without them.
