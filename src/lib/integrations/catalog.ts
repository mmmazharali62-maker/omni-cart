import type { ProviderDef } from "./types";

// The provider catalog: every credential this app can use, configured later
// from the admin Integrations page (nothing hard-coded, per standing rules).
export const PROVIDERS: ProviderDef[] = [
  {
    id: "database",
    label: "Postgres Database",
    category: "database",
    description: "Primary datastore (Neon/Supabase recommended on the free tier).",
    docsPath: "docs/integrations/database.md",
    fields: [
      { name: "url", label: "DATABASE_URL", type: "secret", required: true, placeholder: "postgres://..." },
      { name: "directUrl", label: "DIRECT_URL (optional, pooled setups)", type: "secret" }
    ]
  },
  {
    id: "stripe",
    label: "Stripe Payments",
    category: "payments",
    description: "Card checkout, refunds, and webhooks for US/UK sales.",
    docsPath: "docs/integrations/stripe.md",
    docsUrl: "https://dashboard.stripe.com/apikeys",
    envFallback: { secretKey: "STRIPE_SECRET_KEY", publishableKey: "NEXT_PUBLIC_STRIPE_KEY", webhookSecret: "STRIPE_WEBHOOK_SECRET" },
    fields: [
      { name: "publishableKey", label: "Publishable key", type: "secret", required: true, placeholder: "pk_live_..." },
      { name: "secretKey", label: "Secret key", type: "secret", required: true, placeholder: "sk_live_..." },
      { name: "webhookSecret", label: "Webhook signing secret", type: "secret", placeholder: "whsec_..." }
    ],
    webhooks: [{ label: "Payment events", path: "/api/webhooks/stripe" }]
  },
  {
    id: "cj",
    label: "CJ Dropshipping",
    category: "supplier",
    description: "Product import, pricing, order fulfillment, and tracking.",
    docsPath: "docs/integrations/cj-dropshipping.md",
    envFallback: { apiKey: "CJ_API_KEY" },
    fields: [
      { name: "apiKey", label: "API key", type: "secret", required: true },
      { name: "email", label: "Account email", type: "text", required: true, placeholder: "you@example.com" }
    ]
  },
  {
    id: "aliexpress",
    label: "AliExpress",
    category: "supplier",
    description: "Dropshipper API + affiliate tracking for catalog enrichment.",
    docsPath: "docs/integrations/aliexpress.md",
    envFallback: { apiKey: "ALIEXPRESS_API_KEY" },
    fields: [
      { name: "apiKey", label: "API key", type: "secret", required: true },
      { name: "trackingId", label: "Affiliate tracking ID", type: "text", placeholder: "your_aff_id" }
    ]
  },
  {
    id: "amazon",
    label: "Amazon (PA-API)",
    category: "supplier",
    description: "Product advertising API for US/UK marketplace lookups.",
    docsPath: "docs/integrations/amazon.md",
    envFallback: { accessKey: "AMAZON_ACCESS_KEY", secretKey: "AMAZON_SECRET_KEY" },
    fields: [
      { name: "accessKey", label: "Access key", type: "secret", required: true },
      { name: "secretKey", label: "Secret key", type: "secret", required: true },
      { name: "partnerTag", label: "Partner tag", type: "text", required: true, placeholder: "yourstore-20" },
      { name: "marketplace", label: "Marketplace", type: "select", required: true, options: ["US", "UK"] }
    ]
  },
  {
    id: "email",
    label: "Transactional Email",
    category: "notifications",
    description: "Order confirmations, refunds, and shipping updates (Resend).",
    docsPath: "docs/integrations/email-sms.md",
    envFallback: { apiKey: "EMAIL_PROVIDER_API_KEY", from: "EMAIL_FROM" },
    fields: [
      { name: "apiKey", label: "Resend API key", type: "secret", required: true, placeholder: "re_..." },
      { name: "from", label: "From address", type: "text", required: true, placeholder: "Omni Cart <orders@yourdomain.com>" }
    ]
  },
  {
    id: "sms",
    label: "SMS Notifications",
    category: "notifications",
    description: "Optional shipping SMS via Twilio.",
    docsPath: "docs/integrations/email-sms.md",
    envFallback: { accountSid: "SMS_PROVIDER_ACCOUNT_SID", authToken: "SMS_PROVIDER_AUTH_TOKEN" },
    fields: [
      { name: "accountSid", label: "Twilio Account SID", type: "secret", required: true, placeholder: "AC..." },
      { name: "authToken", label: "Auth token", type: "secret", required: true },
      { name: "fromNumber", label: "From number (E.164)", type: "text", required: true, placeholder: "+15551234567" }
    ]
  }
];

export function getProviderDef(id: string): ProviderDef | undefined {
  return PROVIDERS.find((p) => p.id === id);
}
