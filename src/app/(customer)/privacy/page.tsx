import { GlassPanel } from "@/components/ui/glass-panel";
import { pageMeta } from "@/lib/seo-meta";

export const metadata = pageMeta("Privacy Policy", "How Omni Cart handles your data (US/UK).");

const SECTIONS = [
  ["What we collect", "Account details (name, email), order history, addresses, and anonymized analytics. Payments run through Stripe - we never store card numbers."],
  ["How we use it", "To fulfil orders, send transactional email (order/shipping/refund), prevent fraud, and improve the store. No selling of personal data, ever."],
  ["Cookies", "Essential cookies for cart and login, plus basic analytics. The consent banner lets you decline non-essential cookies."],
  ["Your rights", "GDPR (UK/EU) and CCPA (US) give you access, correction, export, and deletion rights. Email support to exercise them; we respond within 30 days."],
  ["Retention", "Order records are kept 7 years for tax purposes; marketing data until you unsubscribe; analytics 14 months."],
  ["Data location", "Stored with US/EU cloud providers. Cross-border transfers use standard contractual clauses."]
] as const;

export default function PrivacyPage() {
  return (
    <section className="mx-4 mt-12 max-w-3xl">
      <h1 className="text-3xl font-semibold">Privacy policy</h1>
      <div className="mt-6 space-y-4">
        {SECTIONS.map(([title, body]) => (
          <GlassPanel key={title}>
            <h2 className="font-medium">{title}</h2>
            <p className="text-sm text-white/70 mt-2">{body}</p>
          </GlassPanel>
        ))}
      </div>
    </section>
  );
}
