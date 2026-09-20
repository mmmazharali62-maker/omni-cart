// Recommended setup order shown on the admin checklist (spec section 17).
export const SETUP_ORDER = [
  { provider: "database", why: "Nothing runs until the database is connected." },
  { provider: "stripe", why: "Accept live payments from US/UK customers." },
  { provider: "cj", why: "Import your first products and enable auto-fulfillment." },
  { provider: "email", why: "Send order confirmations and shipping updates." },
  { provider: "aliexpress", why: "Broaden the catalog with AliExpress sourcing." },
  { provider: "amazon", why: "Optional: Amazon marketplace lookups." },
  { provider: "sms", why: "Optional: SMS shipping notifications." }
] as const;

// Step-by-step go-live path shown in the UI.
export const GO_LIVE_STEPS = [
  "Connect the database and run migrations",
  "Add Stripe keys and register the webhook URL",
  "Import products from CJ Dropshipping",
  "Configure transactional email",
  "Place a test order end-to-end",
  "Switch DNS / deploy to production"
] as const;
