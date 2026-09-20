import { GlassPanel } from "@/components/ui/glass-panel";
import { pageMeta } from "@/lib/seo-meta";

export const metadata = pageMeta("FAQ", "Answers to common questions about ordering, shipping, and returns.");

const FAQS = [
  ["How long does delivery take?", "US/UK orders arrive in 5-14 days with standard shipping, or 3-7 days with express."],
  ["Is my payment secure?", "Yes. Payments run through Stripe; your card details never touch our servers."],
  ["How do returns work?", "Request a return from your order page within 30 days of delivery. Our team reviews it within 24 hours."],
  ["Where do products ship from?", "Our supplier network ships globally; each product page shows its expected delivery window."],
  ["Can I track my order?", "Yes - open Orders in your account to see live tracking for every shipment."],
  ["Do you charge sales tax?", "Tax is calculated at checkout based on your delivery address (US) or included in price (UK VAT-style)."]
] as const;

export default function FaqPage() {
  return (
    <section className="mx-4 mt-12 max-w-3xl">
      <h1 className="text-3xl font-semibold">Frequently Asked Questions</h1>
      <div className="mt-6 space-y-4">
        {FAQS.map(([q, a]) => (
          <GlassPanel key={q}>
            <h2 className="font-medium">{q}</h2>
            <p className="text-sm text-white/70 mt-2">{a}</p>
          </GlassPanel>
        ))}
      </div>
    </section>
  );
}
