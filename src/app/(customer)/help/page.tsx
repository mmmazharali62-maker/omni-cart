import { GlassPanel } from "@/components/ui/glass-panel";

const faqs = [
  ["Where do you ship?", "We currently ship across the USA and UK. Delivery estimates are shown on each product page."],
  ["How long does delivery take?", "Most orders arrive in 7-14 days depending on the product and your location. Tracking is emailed as soon as your order ships."],
  ["Can I return a product?", "Yes - you can request a return within 30 days of delivery from your account orders page."],
  ["Is my payment secure?", "Payments are processed by Stripe on their secure infrastructure. Your card details never touch our servers."],
  ["How do I track my order?", "Open Account > Orders and select your order. Tracking numbers and status history appear there once shipped."],
  ["Do you offer guest checkout?", "Yes - you can check out with just an email address, no account needed."]
];

export default function HelpPage() {
  return (
    <section className="mx-4 mt-12 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6">Help & Support</h1>
      <div className="space-y-4">
        {faqs.map(([q, a]) => (
          <GlassPanel key={q}>
            <p className="font-medium">{q}</p>
            <p className="text-white/70 text-sm mt-2">{a}</p>
          </GlassPanel>
        ))}
      </div>
      <p className="text-white/40 text-xs mt-8">
        Still stuck? Email support@omnicart.example.com (placeholder until the support inbox is provisioned).
      </p>
    </section>
  );
}
