import { db } from "@/lib/db";
import { GlassPanel } from "@/components/ui/glass-panel";
import { formatMoney } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

// Post-payment success page: Stripe redirects here with ?order=<id>.
export default async function CheckoutSuccessPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const orderId = searchParams.order;
  const order = orderId
    ? await db.order.findUnique({ where: { id: orderId }, include: { items: true } }).catch(() => null)
    : null;

  if (orderId && !order) notFound();

  return (
    <section className="mx-4 mt-16 max-w-2xl">
      <GlassPanel className="text-center py-12">
        <p className="text-5xl">✓</p>
        <h1 className="text-2xl font-semibold mt-4">Thank you for your order!</h1>
        {order ? (
          <>
            <p className="text-white/60 text-sm mt-2">
              Order <span className="font-mono">{order.id.slice(0, 8)}</span> is confirmed.
              A confirmation email is on its way to {order.guestEmail ?? "your inbox"}.
            </p>
            <p className="text-white/70 text-sm mt-4">
              {order.items.length} item{order.items.length > 1 ? "s" : ""} · {formatMoney(Number(order.grandTotal), order.currency)}
            </p>
            <div className="flex justify-center gap-4 mt-8 text-sm">
              <Link href={`/account/orders/${order.id}`} className="px-5 py-2.5 rounded-lg bg-brand-600 text-white">Track Order</Link>
              <Link href="/shop" className="glass px-5 py-2.5 rounded-lg hover:bg-white/10">Continue Shopping</Link>
            </div>
          </>
        ) : (
          <>
            <p className="text-white/60 text-sm mt-2">Your payment went through.</p>
            <Link href="/shop" className="inline-block mt-8 px-5 py-2.5 rounded-lg bg-brand-600 text-white text-sm">Continue Shopping</Link>
          </>
        )}
      </GlassPanel>
    </section>
  );
}
