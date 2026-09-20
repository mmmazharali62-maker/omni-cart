import { GlassPanel } from "@/components/ui/glass-panel";
import { pageMeta } from "@/lib/seo-meta";

export const metadata = pageMeta("Terms of Service", "The terms for shopping with Omni Cart.");

const TERMS = [
  ["Orders", "Placing an order is an offer to buy. It becomes a contract when we confirm shipment. Prices are in USD or GBP as displayed."],
  ["Accounts", "Keep your password private. You're responsible for activity under your account."],
  ["Shipping", "Estimates are typical windows, not guarantees. See our shipping policy for rates and times."],
  ["Returns", "30-day window on eligible categories, as described in the refund policy. Final-sale items are marked on the product page."],
  ["Payment", "We accept major cards via Stripe. Chargebacks without contacting support first may suspend the account."],
  ["Liability", "Our liability is limited to the order value. We're not liable for indirect losses."],
  ["Changes", "We may update these terms; the version in effect is the one published here at the time of your order."]
] as const;

export default function TermsPage() {
  return (
    <section className="mx-4 mt-12 max-w-3xl">
      <h1 className="text-3xl font-semibold">Terms of service</h1>
      <div className="mt-6 space-y-4">
        {TERMS.map(([title, body]) => (
          <GlassPanel key={title}>
            <h2 className="font-medium">{title}</h2>
            <p className="text-sm text-white/70 mt-2">{body}</p>
          </GlassPanel>
        ))}
      </div>
    </section>
  );
}
