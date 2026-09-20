import { db } from "@/lib/db";
import { GlassPanel } from "@/components/ui/glass-panel";
import { formatMoney } from "@/lib/utils";
import { AdminOrderActions } from "@/components/admin/order-actions";

// Admin Orders (spec section 14/32): all orders with retry/cancel/refund actions.
export default async function AdminOrdersPage() {
  const orders = await db.order
    .findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { items: { select: { id: true } }, user: { select: { email: true } } }
    })
    .catch(() => []);

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-6">Orders</h1>
      <GlassPanel>
        {orders.length === 0 ? (
          <p className="text-white/50 text-sm py-4">No orders yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-white/50 text-xs">
              <tr>
                <th className="text-left py-2">Order</th>
                <th className="text-left">Customer</th>
                <th className="text-left">Status</th>
                <th className="text-left">Items</th>
                <th className="text-left">Total</th>
                <th className="text-left">Date</th>
                <th className="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-white/10">
                  <td className="py-3">{o.id.slice(0, 8)}</td>
                  <td className="text-white/70">{o.user?.email ?? o.guestEmail}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      o.status === "FAILED" ? "bg-red-500/20 text-red-300" :
                      o.status === "DELIVERED" ? "bg-emerald-500/20 text-emerald-300" :
                      "bg-white/10 text-white/70"
                    }`}>{o.status.replace(/_/g, " ")}</span>
                  </td>
                  <td className="text-white/70">{o.items.length}</td>
                  <td>{formatMoney(Number(o.grandTotal), o.currency)}</td>
                  <td className="text-white/50">{o.createdAt.toDateString()}</td>
                  <td><AdminOrderActions orderId={o.id} status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </GlassPanel>
    </section>
  );
}
