# Stripe Setup

Stripe powers checkout, refunds, and payment webhooks for US and UK customers.

## Get your keys

1. Create an account at stripe.com (no business entity needed to start in test mode).
2. Dashboard → Developers → **API keys**.
3. Copy the **Publishable key** (`pk_...`) and **Secret key** (`sk_...`).
4. For webhooks: Developers → Webhooks → **Add endpoint**.

## Register the webhook

Point the webhook at:

```
https://your-domain.com/api/webhooks/stripe
```

Events to subscribe:
- `checkout.session.completed`
- `payment_intent.payment_failed`
- `charge.refunded`
- `charge.dispute.created`

Copy the **Signing secret** (`whsec_...`) into the Webhook field.

## Apply it

Admin → Integrations → Stripe Payments: paste all three values, Save, then **Test connection**.

## Go-live checklist

- Switch keys from `pk_test_`/`sk_test_` to live keys.
- Enable your bank payouts (Dashboard → Settings → Bank accounts).
- Make one real £/$ purchase and refund it to validate the loop.
