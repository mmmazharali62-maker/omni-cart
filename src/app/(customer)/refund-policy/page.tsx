import { GlassPanel } from "@/components/ui/glass-panel";
import { pageMeta } from "@/lib/seo-meta";
import { STORE } from "@/lib/config";
import { NON_RETURNABLE_CATEGORIES } from "@/lib/returns/policy";

export const metadata = pageMeta("Refund Policy", "Returns, refunds, and how long they take.");

export default function RefundPolicyPage() {
  return (
    <section className="mx-4 mt-12 max-w-3xl">
      <h1 className="text-3xl font-semibold">Refund policy</h1>
      <GlassPanel className="mt-6 space-y-5 text-sm text-white/70">
        <div>
          <h2 className="font-medium text-white">The {STORE.returnWindowDays}-day window</h2>
          <p>Request a return within {STORE.returnWindowDays} days of delivery. Items must be unused and in original packaging.</p>
        </div>
        <div>
          <h2 className="font-medium text-white">Refund amounts</h2>
          <p>Within 14 days of delivery: full refund. Days 15-{STORE.returnWindowDays}: refund minus 15% restocking fee. Original shipping is non-refundable.</p>
        </div>
        <div>
          <h2 className="font-medium text-white">Timing</h2>
          <p>Refunds are issued within 48 hours of us receiving the item, then take 5-10 business days to appear on your statement.</p>
        </div>
        <div>
          <h2 className="font-medium text-white">Damaged or wrong items</h2>
          <p>Full refund including shipping, plus a prepaid return label. No restocking fee ever applies to our mistakes.</p>
        </div>
        <div>
          <h2 className="font-medium text-white">Final-sale categories</h2>
          <p>These are not returnable: {NON_RETURNABLE_CATEGORIES.join(", ")}.</p>
        </div>
        <div>
          <h2 className="font-medium text-white">Warranty</h2>
          <p>Manufacturing defects within 90 days are replaced free - contact support with photos.</p>
        </div>
      </GlassPanel>
    </section>
  );
}
