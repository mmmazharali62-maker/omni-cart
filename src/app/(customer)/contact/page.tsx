import { GlassPanel } from "@/components/ui/glass-panel";
import { pageMeta } from "@/lib/seo-meta";

export const metadata = pageMeta("Contact", "How to reach Omni Cart support.");

export default function ContactPage() {
  return (
    <section className="mx-4 mt-12 max-w-2xl">
      <h1 className="text-3xl font-semibold">Contact us</h1>
      <GlassPanel className="mt-6 space-y-4 text-sm text-white/70">
        <div>
          <h2 className="font-medium text-white">Support</h2>
          <p>support@omnicart.example.com - replies within 24 hours, 7 days a week.</p>
        </div>
        <div>
          <h2 className="font-medium text-white">Returns &amp; refunds</h2>
          <p>Open a return from your account, or track any order with its tracking number.</p>
        </div>
        <div>
          <h2 className="font-medium text-white">Business inquiries</h2>
          <p>partners@omnicart.example.com</p>
        </div>
        <div>
          <h2 className="font-medium text-white">Response times</h2>
          <p>US: 9am-6pm ET. UK: 9am-6pm GMT. Order issues are prioritized.</p>
        </div>
      </GlassPanel>
    </section>
  );
}
