# Integrations Guide

Omni Cart supports 7 integrations, all configurable later from **Admin → Integrations**.
Keys are encrypted (AES-256-GCM) in the database and never appear in logs or GitHub.

| Provider | What it enables | Required for |
|---|---|---|
| [Postgres Database](database.md) | The app's datastore | Everything |
| [Stripe](stripe.md) | Live US/UK payments | Selling |
| [CJ Dropshipping](cj-dropshipping.md) | Product import + auto-fulfillment | Dropshipping |
| [AliExpress](aliexpress.md) | Catalog enrichment | Optional |
| [Amazon PA-API](amazon.md) | Marketplace lookups | Optional |
| [Email (Resend)](email-sms.md) | Order + shipping emails | Recommended |
| [SMS (Twilio)](email-sms.md) | Shipping SMS | Optional |

## How it works

1. Open **Admin → Integrations** in the app.
2. Pick a provider, paste its keys, hit Save. Values are encrypted at rest.
3. Press **Test connection** to verify live against the provider.
4. Nothing blocks until then: the store runs fine with zero keys, and each
   feature activates the moment its credentials exist.

## Precedence rule

If the same key is set both as an environment variable (at deploy time) and in
the admin UI, the **env var wins**. That keeps production deployments in control
while still letting you configure everything from the dashboard.

## Security notes

- Keys are encrypted with a master key from `INTEGRATIONS_MASTER_KEY` (or `NEXTAUTH_SECRET`).
- Admin-only: every save/clear/test is audit-logged (`AuditLog`), without values.
- Masked display only: secrets never return from the API unmasked.
