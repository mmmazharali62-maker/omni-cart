# Email (Resend) and SMS (Twilio) Setup

## Resend - transactional email

Sends order confirmations, refund notices, shipping updates, and back-in-stock
alerts.

1. Create an account at resend.com (free tier: 100 emails/day).
2. Dashboard → **API Keys** → Create. Copy the key (`re_...`).
3. (Production) Verify your sending domain under Domains. Until then you can
   send from `onboarding@resend.dev` for testing.
4. Admin → Integrations → Transactional Email: paste the key and the From
   address (e.g. `Omni Cart <orders@yourdomain.com>`), Save, **Test connection**.

Until configured, the app logs emails to the console instead of sending - dev
flows keep working.

## Twilio - shipping SMS (optional)

1. Create an account at twilio.com.
2. Console: copy the **Account SID** (`AC...`) and create an **Auth Token**.
3. Buy or claim a sender number (E.164 format, e.g. `+15551234567`).
4. Admin → Integrations → SMS Notifications: paste all three, Save,
   **Test connection**.

SMS is off by default; customers opt in per order.

## Message catalog

| Event | Channel |
|---|---|
| Order received / paid | Email |
| Order shipped + tracking | Email + SMS (opt-in) |
| Delivered | Email |
| Refund issued | Email |
| Return status change | Email |
| Back in stock | Email |
| Supplier failure | Email (admin) |
