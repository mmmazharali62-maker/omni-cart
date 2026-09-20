import Link from "next/link";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GlassPanel } from "@/components/ui/glass-panel";
import { formatMoney } from "@/lib/utils";

export default async function AccountOrdersPage() {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as any)?.id;

  const orders = userId
    ? await db.order.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 50 }).catch(() => [])
    : [];

  return (
    <section className="mx-4 mt-12 max-w-4xl">
      <h1 className="text-2xl font-semibold mb-6">My Orders</h1>
      {!userId ? (
        <GlassPanel className="text-center py-16"><p className="text-white/60">Sign in to see your orders.</p></GlassPanel>
      ) : orders.length === 0 ? (
        <p className="text-white/50 text-sm">No orders yet. <Link href="/shop" className="text-brand-400">Start shopping</Link>.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <Link key={o.id} href={`/account/orders/${o.id}`}>
              <GlassPanel className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium">Order {o.id.slice(0, 8)}</p>
                  <p className="text-xs text-white/50 mt-1">{o.createdAt.toDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{formatMoney(Number(o.grandTotal), o.currency)}</p>
                  <p className="text-xs text-brand-400 mt-1">{o.status.replace(/_/g, " ")}</p>
                </div>
              </GlassPanel>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
