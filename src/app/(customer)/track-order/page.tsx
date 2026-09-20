import { pageMeta } from "@/lib/seo-meta";
import { TrackOrderForm } from "./track-order-form";
import { db } from "@/lib/db";

export const metadata = pageMeta("Track Order", "Live tracking for your Omni Cart order.");

export default async function TrackOrderPage() {
  let demoNumber: string | null = null;
  try {
    const shipment = await db.shipment.findFirst({
      where: { trackingNumber: { not: null } },
      orderBy: { createdAt: "desc" },
      select: { trackingNumber: true }
    });
    demoNumber = shipment?.trackingNumber ?? null;
  } catch { /* db not connected yet - page still renders */ }

  return (
    <section className="mx-4 mt-12 max-w-lg">
      <h1 className="text-3xl font-semibold">Track your order</h1>
      <p className="text-white/50 text-sm mt-1">Enter the tracking number from your shipping email.</p>
      <div className="mt-6">
        <TrackOrderForm />
      </div>
      {demoNumber && (
        <p className="text-xs text-white/30 mt-4">Example number in the system: {demoNumber}</p>
      )}
    </section>
  );
}
