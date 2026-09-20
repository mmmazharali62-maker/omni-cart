import { db } from "@/lib/db";
import { GlassPanel } from "@/components/ui/glass-panel";
import { EmptyState } from "@/components/ui/empty-state";
import { bundlePrice, bundlePitch, bundleSavings } from "@/lib/bundles";
import { pageMeta } from "@/lib/seo-meta";

export const metadata = pageMeta("Bundles", "Buy together and save - Omni Cart bundles.");

// Static curated bundles (spec section 15); admin-managed ones come via the pricing engine.
const BUNDLES = [
  { id: "desk-setup", title: "Desk Setup Starter", discountPct: 15, items: ["Standing desk converter", "LED desk lamp", "Cable organizer"] },
  { id: "audio-pack", title: "Audio Essentials", discountPct: 12, items: ["Wireless earbuds", "Bluetooth speaker", "USB-C cable 2m"] }
];

export default async function BundlesPage() {
  const products = await db.product.findMany({
    where: { status: "ACTIVE" },
    select: { title: true, basePrice: true },
    take: 100
  }).catch(() => []);

  return (
    <section className="mx-4 mt-12 max-w-4xl">
      <h1 className="text-3xl font-semibold">Bundles</h1>
      <p className="text-white/50 text-sm mt-1 mb-6">Curated sets, priced together.</p>
      <div className="space-y-4">
        {BUNDLES.map((b) => {
          const priced = b.items.map((title) => {
            const match = products.find((p) => p.title.toLowerCase().includes(title.toLowerCase().split(" ")[0]));
            return { title, price: match ? Number(match.basePrice) : 0 };
          });
          const bundle = { id: b.id, title: b.title, items: priced, discountPct: b.discountPct };
          const savings = bundleSavings(bundle);
          return (
            <GlassPanel key={b.id} className="p-5">
              <h2 className="font-medium">{b.title}</h2>
              <p className="text-xs text-emerald-400 mt-1">{bundlePitch(savings)}</p>
              <ul className="text-sm text-white/70 mt-3 space-y-1">
                {priced.map((i, idx) => <li key={idx}>{i.title}</li>)}
              </ul>
              <p className="text-lg font-semibold mt-3">${bundlePrice(bundle).toFixed(2)}</p>
            </GlassPanel>
          );
        })}
        {products.length === 0 && (
          <EmptyState title="Catalog warming up" message="Bundles unlock as products sync from suppliers." />
        )}
      </div>
    </section>
  );
}
