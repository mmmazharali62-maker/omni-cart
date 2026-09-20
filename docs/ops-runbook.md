# Ops Runbook

The 3am playbook: what to check, in what order, when something looks wrong.

## First 5 minutes

1. `/api/health` - overall ok / degraded / down?
2. Admin → Integrations: is the DB card green? Any provider "fail" on its last test?
3. Admin → Digest: orders in the last 24h? failed syncs? low stock?

## Common incidents

### Orders stopped flowing
- Check Stripe keys: Integrations → Stripe → Test connection.
- A failing webhook shows in Audit Log as missing `checkout.session.completed`.

### Products not syncing
- Admin → Supplier Health: a score under 60 stops auto-routing (by design).
- Failed webhook events sit in `WebhookEvent` with `processedAt = null`.
- Re-run the sync job after fixing credentials; never re-import while a sync is mid-flight.

### Payments failing for customers
- Confirm Stripe is in live mode (`sk_live_...`) and payouts are enabled.
- Test one checkout with a real card, then refund it.

### Fraud hold backlog
- Admin → Fraud Review: clear or cancel each flag; holds release fulfillment.
- Recurring false positives: tune thresholds in `src/lib/fraud/checks.ts`.

### Database issues
- `npx prisma migrate deploy` after any schema release.
- Backups: provider-level (Neon/Supabase restore points). Verify monthly.

## Escalation

- Stripe: dashboard → developers → logs.
- CJ/AliExpress: API status pages; incidents land as `sync_failure` digests.
- Email: Resend dashboard → logs (bounces throttle sending).

## Change management

- Every admin write is in Audit Log with user + payload metadata.
- Deploy forward; roll back app releases by redeploying the previous build.
