import { GlassPanel } from "@/components/ui/glass-panel";
import { bundlePitch, bundlePrice, bundleSavings } from "@/lib/bundles";

// Buy-together bundle offer on the product page (spec section 15).
export function BundleOffer({
  title,
  items,
  discountPct
}: {
  title: string;
  items: Array<{ title: string; image?: string | null }>;
  discountPct: number;
}) {
  const prices = items.map((i) => ({ price: 0 })); // prices injected server-side
  const bundle = { id: title, title, items: prices, discountPct };
  const savings = bundleSavings(bundle);
  return (
    <GlassPanel className="p-4">
      <p className="text-sm font-medium">{bundlePitch(savings)}</p>
      <ul className="text-sm text-white/70 mt-2 space-y-1">
        {items.map((i, idx) => (
          <li key={idx} className="flex items-center gap-2">
            {i.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={i.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
            )}
            {i.title}
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between mt-3">
        <span className="text-lg font-semibold">{bundlePrice(bundle) > 0 ? formatPrice(bundlePrice(bundle)) : ""}</span>
      </div>
    </GlassPanel>
  );
}

function formatPrice(n: number): string {
  return `$${n.toFixed(2)}`;
}
