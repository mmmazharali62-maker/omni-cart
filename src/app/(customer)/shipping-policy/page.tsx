import { GlassPanel } from "@/components/ui/glass-panel";
import { pageMeta } from "@/lib/seo-meta";

export const metadata = pageMeta("Shipping Policy", "Delivery times, costs, and coverage for US and UK orders.");

export default function ShippingPolicyPage() {
  return (
    <section className="mx-4 mt-12 max-w-3xl">
      <h1 className="text-3xl font-semibold">Shipping Policy</h1>
      <GlassPanel className="mt-6 space-y-4 text-white/70 leading-relaxed text-sm">
        <div>
          <h2 className="font-medium text-white">Rates</h2>
          <p>Standard shipping is $5.99 to the US and £4.99 to the UK, free on orders over $50/£40. Express is a flat $14.99/£12.99.</p>
        </div>
        <div>
          <h2 className="font-medium text-white">Delivery times</h2>
          <p>Standard: 7-14 business days. Express: 3-7 business days. Supplier processing adds 1-3 days on new releases.</p>
        </div>
        <div>
          <h2 className="font-medium text-white">Tracking</h2>
          <p>Every shipment gets a tracking number. It appears on your order page and is emailed as soon as the carrier scans the parcel.</p>
        </div>
        <div>
          <h2 className="font-medium text-white">Coverage</h2>
          <p>We currently ship to the United States and United Kingdom, including PO boxes via standard post.</p>
        </div>
        <div>
          <h2 className="font-medium text-white">Lost or delayed parcels</h2>
          <p>If tracking shows no movement for 10 days, contact support and we will reship or refund - your choice.</p>
        </div>
      </GlassPanel>
    </section>
  );
}
