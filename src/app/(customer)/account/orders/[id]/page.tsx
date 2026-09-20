import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { GlassPanel } from "@/components/ui/glass-panel";
import { formatMoney } from "@/lib/utils";

// Order details + tracking timeline for the customer (spec section 6/12).
export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await db.order
    .findUnique({
      where: { id: params.id },
      include: { items: true, shipments: { include: { events: { orderBy: { occurredAt: "desc" } } } } }
    })
    .catch(() => null);

  if (!order) notFound();
  // TODO: enforce ownership via session (or signed guest-order token).

  const steps = ["PENDING", "PAID", "PROCESSING", "FULFILLED", "SHIPPED", "IN_TRANSIT", "DELIVERED"];
  const currentIdx = steps.indexOf(order.status);

  return (
    <section className="mx-4 mt-12 max-w-4xl">
      <h1 className="text-2xl font-semibold">Order {order.id.slice(0, 8)}</h1>
      <p className="text-white/60 text-sm mt-1">Placed {order.createdAt.toDateString()} · Status: {order.status}</p>

      <GlassPanel className="mt-6">
        <div className="flex flex-wrap gap-2 text-xs">
          {steps.map((s, i) => (
            <span key={s} className={`px-3 py-1.5 rounded-full ${i <= currentIdx ? "bg-brand-600 text-white" : "bg-white/10 text-white/50"}`}>
              {s.replace("_", " ")}
            </span>
          ))}
        </div>
      </GlassPanel>

      {order.shipments.map((sh) => (
        <GlassPanel key={sh.id} className="mt-6">
          <p className="font-medium">Shipment {sh.id.slice(0, 8)}</p>
          {sh.trackingNumber && (
            <p className="text-sm text-white/70 mt-2">Tracking: {sh.trackingNumber} ({sh.carrier})</p>
          )}
          {sh.events.length > 0 && (
            <ul className="mt-4 space-y-2 text-sm">
              {sh.events.map((e) => (
                <li key={e.id} className="text-white/70">
                  <span className="text-white">{e.status.replace(/_/g, " ")}</span>
                  {e.location ? ` · ${e.location}` : ""} · {e.occurredAt.toLocaleDateString()}
                </li>
              ))}
            </ul>
          )}
        </GlassPanel>
      ))}

      <GlassPanel className="mt-6">
        <p className="font-medium mb-4">Items</p>
        <ul className="space-y-3 text-sm">
          {order.items.map((i) => (
            <li key={i.id} className="flex justify-between border-b border-white/10 pb-3">
              <span>{i.title} × {i.quantity}</span>
              <span>{formatMoney(Number(i.unitPrice) * i.quantity, order.currency)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 text-sm space-y-1">
          <p className="flex justify-between text-white/70"><span>Subtotal</span><span>{formatMoney(Number(order.subtotal), order.currency)}</span></p>
          <p className="flex justify-between text-white/70"><span>Shipping</span><span>{formatMoney(Number(order.shippingTotal), order.currency)}</span></p>
          <p className="flex justify-between text-white/70"><span>Tax</span><span>{formatMoney(Number(order.taxTotal), order.currency)}</span></p>
          {Number(order.discountTotal) > 0 && (
            <p className="flex justify-between text-emerald-400"><span>Discount</span><span>-{formatMoney(Number(order.discountTotal), order.currency)}</span></p>
          )}
          <p className="flex justify-between font-semibold text-base pt-2"><span>Total</span><span>{formatMoney(Number(order.grandTotal), order.currency)}</span></p>
        </div>
      </GlassPanel>
    </section>
  );
}
