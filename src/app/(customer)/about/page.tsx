import { GlassPanel } from "@/components/ui/glass-panel";
import { pageMeta } from "@/lib/seo-meta";
import { TrustBadges } from "@/components/home/trust-badges";

export const metadata = pageMeta("About Us", "Who we are and why shoppers in the US and UK trust Omni Cart.");

export default function AboutPage() {
  return (
    <section className="mx-4 mt-12 max-w-3xl">
      <h1 className="text-3xl font-semibold">About Omni Cart</h1>
      <GlassPanel className="mt-6">
        <p className="text-white/70 leading-relaxed">
          Omni Cart brings together the best products from global suppliers into one
          curated store for shoppers in the United States and the United Kingdom.
          We handle sourcing, quality checks, and fulfillment tracking so you can shop
          with confidence.
        </p>
        <p className="text-white/70 leading-relaxed mt-4">
          Every order is backed by our 30-day return policy, secure Stripe checkout,
          and real-time tracking from our supplier network to your door.
        </p>
      </GlassPanel>
      <TrustBadges />
    </section>
  );
}
